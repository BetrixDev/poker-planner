import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createIssue = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.string(),
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

    const isFacilitator = room.facilitatorIds.includes(identity.subject as any);

    if (!isFacilitator) {
      throw new ConvexError("You must be a facilitator to create an issue");
    }

    return await ctx.db.insert("issues", {
      roomId: args.roomId,
      title: args.title,
      description: args.description,
      order: 0,
      isCompleted: false,
    });
  },
});
