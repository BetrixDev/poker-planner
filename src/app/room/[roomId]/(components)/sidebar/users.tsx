"use client";

import usePresence from "@convex-dev/presence/react";
import { useQuery } from "convex/react";
import { UsersIcon } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export function Users({ presenceId }: { presenceId: string }) {
  const params = useParams<{ roomId: Id<"rooms"> }>();

  const roomData = useQuery(api.rooms.getRoomById, { id: params.roomId });

  const presence = usePresence(api.presence, params.roomId, presenceId) ?? [];

  if (!roomData) {
    return null;
  }

  const roomUsers = roomData.room?.users?.map((user) => {
    const userPresence = presence.find((p) => p.userId === user.presenceId);
    return {
      ...user,
      online: userPresence?.online,
    };
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Users</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <UsersIcon /> <span className="sr-only">Inivte User</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <InviteUserDialogContent />
      </Dialog>
      <SidebarGroupContent>
        {roomUsers.map((user) => (
          <div key={user.presenceId}>
            <h1>{user.displayName}</h1>
            <p>{user.online ? "Online" : "Offline"}</p>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function InviteUserDialogContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite User</DialogTitle>
      </DialogHeader>
    </DialogContent>
  );
}
