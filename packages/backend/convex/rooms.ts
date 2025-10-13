import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";
import { getDefaultUserProfileImage } from "./utils";

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
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
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
      settings: {},
      ownerId: user.subject,
      code,
      users: [
        {
          userId: user.subject,
          presenceId: user.subject,
          displayName: user.name ?? user.subject,
          role: "facilitator",
          profileImage: getDefaultUserProfileImage(user.subject),
        },
      ],
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
      return null;
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

    if (!room) {
      throw new ConvexError("Room not found");
    }

    const roomIssues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    const selectedIssue = room.selectedIssueId
      ? await ctx.db.get(room.selectedIssueId)
      : null;

    return {
      room,
      issues: roomIssues,
      selectedIssue,
    };
  },
});

export const getRoomUsers = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const roomData = await ctx.db.get(args.roomId);

    if (!roomData) {
      throw new ConvexError("Room not found");
    }

    const authedUsers = await Promise.all(
      roomData.users.map((user) => {
        if (!user.userId) {
          return null;
        }

        return authComponent.getAnyUserById(
          ctx as any,
          user.userId ?? user.presenceId
        );
      })
    );

    return roomData.users.map((user) => {
      const authedUser = authedUsers.find(
        (authedUser) => authedUser?._id === user.userId
      );

      return {
        id: user.presenceId,
        username:
          authedUser?.name ??
          authedUser?.displayUsername ??
          authedUser?.username ??
          authedUser?.email ??
          "Anonymous",
        role: user.role,
      };
    });
  },
});

export const getRoomByInviteCode = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
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

export const deleteRoom = mutation({
  args: {
    id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User is not authenticated");
    }

    const room = await ctx.db.get(args.id);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to delete this room");
    }

    // Delete all issues associated with the room
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", args.id))
      .collect();

    for (const issue of issues) {
      await ctx.db.delete(issue._id);
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

export const listRoomsForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to view your rooms");
    }

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .collect();

    return rooms;
  },
});

export const renameRoom = mutation({
  args: {
    id: v.id("rooms"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User is not authenticated");
    }

    const room = await ctx.db.get(args.id);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (room.ownerId !== identity.subject) {
      throw new ConvexError("You must be the owner to rename this room");
    }

    await ctx.db.patch(args.id, { name: args.name });
    return null;
  },
});

export const selectIssueInRoom = mutation({
  args: {
    id: v.id("issues"),
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

    if (
      room.users.find((user) => user.userId === identity.subject)?.role !==
      "facilitator"
    ) {
      throw new ConvexError("You must be a facilitator to start a vote");
    }

    const issue = await ctx.db.get(args.id);

    if (!issue) {
      throw new ConvexError("Issue not found");
    }

    if (issue.roomId !== args.roomId) {
      throw new ConvexError("Issue does not belong to this room");
    }

    const otherRoomIssues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const otherIssue of otherRoomIssues) {
      await ctx.db.patch(otherIssue._id, {
        status: { type: "pendingVote" },
      });
    }

    await ctx.db.patch(args.id, {
      status: { type: "roomSelectedIssue" },
    });

    await ctx.db.patch(args.roomId, {
      selectedIssueId: args.id,
    });
  },
});
