"use client";

import usePresence from "@convex-dev/presence/react";
import { useQuery } from "convex/react";
import { UserStarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  Dialog,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export function Facilitators({ presenceId }: { presenceId: string }) {
  const params = useParams<{ roomId: Id<"rooms"> }>();

  const roomData = useQuery(api.rooms.getRoomById, { id: params.roomId });

  const presence = usePresence(api.presence, params.roomId, presenceId) ?? [];

  if (!roomData) {
    return null;
  }

  const roomFacilitators = roomData.room?.users
    ?.filter((user) => user.role === "facilitator")
    ?.map((facilitator) => {
      const facilitatorPresence = presence.find(
        (p) => p.userId === facilitator.presenceId
      );

      if (!facilitatorPresence) {
        return {
          userId: facilitator.presenceId,
          lastSeen: "Unknown",
          username: "Unknown",
          online: false,
        };
      }

      return {
        userId: facilitator.userId,
        lastSeen: new Date(
          facilitatorPresence.lastDisconnected
        ).toLocaleString(),
        online: facilitatorPresence.online,
        username: facilitatorPresence.name ?? "Unknown",
      };
    });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Facilitators</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <UserStarIcon /> <span className="sr-only">Add Facilitator</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <AddFacilitatorDialogContent />
      </Dialog>
      <SidebarGroupContent>
        {roomFacilitators.map((facilitator) => (
          <div key={facilitator.userId}>
            <h1>{facilitator.username}</h1>
            <p>{facilitator.lastSeen}</p>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AddFacilitatorDialogContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Facilitator</DialogTitle>
      </DialogHeader>
    </DialogContent>
  );
}
