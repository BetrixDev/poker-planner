import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    code: v.string(),
    password: v.optional(v.string()),
    name: v.string(),
    ownerId: v.string(),
    status: v.union(v.literal("votingActive"), v.literal("votesRevealed")),
    currentIssueId: v.optional(v.id("issues")),
    settings: v.object({}),
    users: v.array(
      v.object({
        userId: v.optional(v.string()),
        presenceId: v.string(),
        displayName: v.string(),
        role: v.union(
          v.literal("facilitator"),
          v.literal("user"),
          v.literal("spectator")
        ),
        profileImage: v.string(),
      })
    ),
  })
    .index("by_code", ["code"])
    .index("by_owner", ["ownerId"])
    .index("by_users", ["users"]),

  inviteLinks: defineTable({
    roomId: v.id("rooms"),
    link: v.string(),
    usesLeft: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
  })
    .index("by_room", ["roomId"])
    .index("by_link", ["link"]),

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
