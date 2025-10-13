import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { workflow } from ".";
import { z } from "zod";
import { internal } from "./_generated/api";
import { vResultValidator } from "@convex-dev/workpool";
import { vWorkflowId } from "@convex-dev/workflow";
import { generateObject, generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const issueIngestionWorkflow = workflow.define({
  args: { ingestionId: v.id("issueIngestions") },
  handler: async (step, args) => {
    const imageUrl = await step.runQuery(
      internal.issueIngestion.getIngestionImageUrl,
      {
        ingestionId: args.ingestionId,
      }
    );

    const issues = await step.runAction(
      internal.issueIngestion.extractIssuesFromImage,
      {
        imageUrl,
      }
    );

    await step.runMutation(internal.issueIngestion.addExtractedIssues, {
      ingestionId: args.ingestionId,
      issues,
    });

    await step.runMutation(internal.issueIngestion.removeIngestion, {
      ingestionId: args.ingestionId,
    });
  },
});

export const handleIngestionCompleted = internalMutation({
  args: {
    workflowId: vWorkflowId,
    result: vResultValidator,
    context: v.object({
      ingestionId: v.id("issueIngestions"),
    }),
  },
  handler: async (ctx, args) => {
    const ingestion = await ctx.db.get(args.context.ingestionId);

    if (!ingestion) {
      throw new ConvexError("Ingestion not found");
    }

    await ctx.db.patch(args.context.ingestionId, {
      status: {
        type: "failed",
      },
    });

    await ctx.scheduler.runAfter(
      5000,
      internal.issueIngestion.removeIngestion,
      {
        ingestionId: args.context.ingestionId,
      }
    );
  },
});

export const removeIngestion = internalMutation({
  args: {
    ingestionId: v.id("issueIngestions"),
  },
  handler: async (ctx, args) => {
    const ingestion = await ctx.db.get(args.ingestionId);

    if (!ingestion) {
      throw new ConvexError("Ingestion not found");
    }

    await ctx.db.delete(args.ingestionId);
    await ctx.storage.delete(ingestion.imageid);
  },
});

export const addExtractedIssues = internalMutation({
  args: {
    ingestionId: v.id("issueIngestions"),
    issues: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ingestion = await ctx.db.get(args.ingestionId);

    if (!ingestion) {
      throw new ConvexError("Ingestion not found");
    }

    await ctx.db.patch(args.ingestionId, {
      status: {
        type: "completed",
        issuesFound: args.issues.length,
      },
    });

    for (const issue of args.issues) {
      await ctx.db.insert("issues", {
        roomId: ingestion.roomId,
        title: issue.title,
        description: issue.description,
        order: 0,
        status: {
          type: "pendingVote",
        },
      });
    }
  },
});

export const getIngestionImageUrl = internalQuery({
  args: { ingestionId: v.id("issueIngestions") },
  handler: async (ctx, args) => {
    const ingestion = await ctx.db.get(args.ingestionId);

    if (!ingestion) {
      throw new ConvexError("Ingestion not found");
    }

    const imageUrl = await ctx.storage.getUrl(ingestion.imageid);

    if (!imageUrl) {
      throw new ConvexError("Image not found");
    }

    return imageUrl;
  },
});

const extractIssuesFromImageSchema = z.object({
  issues: z
    .array(
      z.object({
        title: z.string().describe("The title of the issue"),
        description: z
          .optional(z.string())
          .describe("The description of the issue"),
      })
    )
    .describe("The list of issues defined in the image"),
});

export const extractIssuesFromImage = internalAction({
  args: { imageUrl: v.string() },
  handler: async (_, args) => {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const result = await generateObject({
      model: openrouter.chat("google/gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract issues defined in the screenshot. Include a title for each issue and presented in the screenshot and if applicable, a description of the issue. Only include the description if it is providing meaningful information not present in the title of the issue.",
            },
            {
              type: "image",
              image: args.imageUrl,
            },
          ],
        },
      ],
      schema: extractIssuesFromImageSchema,
      schemaName: "issues",
      schemaDescription: "The list of issues defined in the image",
    });

    console.log("data", result.object);

    return result.object.issues;
  },
});

export const generateUploadUrl = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const room = await ctx.db.get(args.roomId);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to ingest issues");
    }

    const existingIngestionsByUser = await ctx.db
      .query("issueIngestions")
      .withIndex("by_uploadedBy", (q) => q.eq("uploadedBy", identity.subject))
      .collect();

    if (existingIngestionsByUser.length >= 1) {
      throw new ConvexError("You can only have one ingestion at a time");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const createIssueIngestion = mutation({
  args: {
    roomId: v.id("rooms"),
    imageid: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const room = await ctx.db.get(args.roomId);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to ingest issues");
    }

    const ingestionId = await ctx.db.insert("issueIngestions", {
      roomId: args.roomId,
      imageid: args.imageid,
      status: {
        type: "processing",
      },
      uploadedBy: identity.subject,
    });

    await workflow.start(
      ctx,
      internal.issueIngestion.issueIngestionWorkflow,
      {
        ingestionId,
      },
      {
        onComplete: internal.issueIngestion.handleIngestionCompleted,
        context: {
          ingestionId,
        },
      }
    );

    return ingestionId;
  },
});

export const getIngestionsByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("issueIngestions")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});
