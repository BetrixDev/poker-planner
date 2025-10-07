import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  rooms: defineTable({
    code: v.string(),
    name: v.string(),
    facilitatorId: v.id("users"),
    isVotingActive: v.boolean(),
    votesRevealed: v.boolean(),
    currentIssueId: v.optional(v.id("issues")),
    settings: v.object({
      allowSpectators: v.boolean(),
      autoReveal: v.boolean(),
      customCards: v.optional(v.array(v.string())),
    }),
  })
    .index("by_code", ["code"])
    .index("by_facilitator", ["facilitatorId"]),

  roomUsers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    displayName: v.string(),
    isSpectator: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  votes: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    issueId: v.optional(v.id("issues")),
    value: v.number(),
    votedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_issue", ["roomId", "issueId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  issues: defineTable({
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    isCompleted: v.boolean(),
    finalEstimate: v.optional(v.string()),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_order", ["roomId", "order"]),
});
