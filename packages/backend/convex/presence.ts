import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { getDefaultUserDisplayName, getDefaultUserProfileImage } from "./utils";
import { authComponent } from "./auth";

export const presence = new Presence(components.presence);

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const users = await presence.listRoom(ctx, roomToken);

    return await Promise.all(
      users.map(async (user) => {
        const userData =
          user.userId.length > 15
            ? await authComponent.getAnyUserById(ctx as any, user.userId)
            : null;

        return {
          ...user,
          profileImage: getDefaultUserProfileImage(user.userId),
          displayName:
            userData?.displayUsername ??
            userData?.name ??
            getDefaultUserDisplayName(user.userId),
        };
      })
    );
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    return await presence.disconnect(ctx, sessionToken);
  },
});
