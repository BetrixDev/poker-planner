import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),

  rooms: defineTable({
    code: v.string(),
    password: v.optional(v.string()),
    inviteLink: v.string(),
    name: v.string(),
    facilitatorIds: v.array(v.string()),
    ownerId: v.string(),
    status: v.union(v.literal("votingActive"), v.literal("votesRevealed")),
    currentIssueId: v.optional(v.id("issues")),
    settings: v.object({}),
  })
    .index("by_code", ["code"])
    .index("by_facilitators", ["facilitatorIds"])
    .index("by_invite_link", ["inviteLink"]),

  roomUsers: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    displayName: v.optional(v.string()),
    isSpectator: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  votes: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    issueId: v.optional(v.id("issues")),
    value: v.number(),
    votedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_issue", ["roomId", "issueId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  sprints: defineTable({
    roomId: v.id("rooms"),
    name: v.string(),
    startDate: v.number(),
    description: v.optional(v.string()),
    endDate: v.number(),
    order: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_order", ["roomId", "order"]),

  issues: defineTable({
    roomId: v.id("rooms"),
    sprintId: v.optional(v.id("sprints")),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    isCompleted: v.boolean(),
    finalEstimate: v.optional(v.string()),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_order", ["roomId", "order"])
    .index("by_room_and_sprint", ["roomId", "sprintId"]),
});
