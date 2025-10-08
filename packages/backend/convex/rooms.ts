import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generate a unique 6-character room code
function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const createRoom = mutation({
  args: {
    name: v.string(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User is not authenticated");
    }

    let code = generateRoomCode();
    let existingRoom = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    while (existingRoom) {
      code = generateRoomCode();
      existingRoom = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
    }

    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      password: args.password,
      status: "votingActive",
      currentIssueId: undefined,
      settings: {},
      facilitatorIds: [],
      code,
    });

    await ctx.db.insert("roomUsers", {
      roomId,
      userId: identity.subject as any,
      isSpectator: false,
      lastSeen: Date.now(),
    });

    return roomId;
  },
});

export const getRoomByJoinCodeAndPassword = query({
  args: {
    code: v.string(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!room || room.password !== args.password) {
      return false;
    }

    return room._id;
  },
});

export const getRoomById = query({
  args: {
    id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);

    const roomUsers = await ctx.db
      .query("roomUsers")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();
    const roomIssues = await ctx.db

      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();

    const roomVotes = await ctx.db
      .query("votes")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();

    return {
      room,
      users: roomUsers,
      issues: roomIssues,
      votes: roomVotes,
    };
  },
});

export const getRoomIssues = query({
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
