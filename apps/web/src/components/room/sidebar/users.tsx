import usePresence from "@convex-dev/presence/react";
import { useQuery } from "convex/react";
import { UsersIcon } from "lucide-react";
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
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import { Route } from "~/routes/room_.$roomId";

export function Users({ presenceId }: { presenceId: string }) {
  const params = Route.useParams();

  const roomData = useQuery(api.rooms.getRoomById, {
    id: params.roomId as Id<"rooms">,
  });

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
