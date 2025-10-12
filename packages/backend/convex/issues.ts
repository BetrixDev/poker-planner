import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createIssue = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.optional(v.string()),
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
      throw new ConvexError("You must be the owner to create an issue");
    }

    // Get the highest order number to add at the end
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const maxOrder = issues.reduce(
      (max, issue) => Math.max(max, issue.order),
      -1
    );

    return await ctx.db.insert("issues", {
      roomId: args.roomId,
      title: args.title,
      description: args.description,
      order: maxOrder + 1,
      isCompleted: false,
    });
  },
});

export const updateIssue = mutation({
  args: {
    id: v.id("issues"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const issue = await ctx.db.get(args.id);

    if (!issue) {
      throw new ConvexError("Issue not found");
    }

    const room = await ctx.db.get(issue.roomId);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to update an issue");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

export const deleteIssue = mutation({
  args: {
    id: v.id("issues"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const issue = await ctx.db.get(args.id);

    if (!issue) {
      throw new ConvexError("Issue not found");
    }

    const room = await ctx.db.get(issue.roomId);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to delete an issue");
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const getIssues = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});
