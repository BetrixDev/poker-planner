import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    code: v.string(),
    password: v.optional(v.string()),
    name: v.string(),
    ownerId: v.string(),
    status: v.union(v.literal("votingActive"), v.literal("votesRevealed")),
    settings: v.object({}),
    selectedIssueId: v.optional(v.id("issues")),
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
        currentVote: v.optional(v.number()),
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

  issues: defineTable({
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    order: v.number(),
    status: v.union(
      v.object({
        type: v.literal("pendingVote"),
      }),
      v.object({
        type: v.literal("roomSelectedIssue"),
      }),
      v.object({
        type: v.literal("voted"),
        estimate: v.number(),
      })
    ),
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_order", ["roomId", "order"]),

  issueIngestions: defineTable({
    roomId: v.id("rooms"),
    uploadedBy: v.string(),
    imageid: v.id("_storage"),
    status: v.union(
      v.object({
        type: v.literal("processing"),
      }),
      v.object({
        type: v.literal("failed"),
      }),
      v.object({
        type: v.literal("completed"),
        issuesFound: v.number(),
      })
    ),
  })
    .index("by_room", ["roomId"])
    .index("by_uploadedBy", ["uploadedBy"]),
});
