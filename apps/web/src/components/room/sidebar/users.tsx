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
import { UserCard } from "./user-card";

export function Users() {
  const params = Route.useParams();

  const roomData = useQuery(api.rooms.getRoomById, {
    id: params.roomId as Id<"rooms">,
  });

  const presence =
    useQuery(api.presence.list, {
      roomToken: roomData?.room?._id ?? "",
    }) ?? [];

  if (!roomData) {
    return null;
  }

  const roomUsers = presence
    .filter((presenceUser) => {
      if (!presenceUser.lastDisconnected) return true;
      const lastDisconnectedDate = new Date(presenceUser.lastDisconnected);
      const now = new Date();
      const diff = now.getTime() - lastDisconnectedDate.getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      return diff <= oneDayMs;
    })
    .map((presenceUser) => {
      const user = roomData.room?.users?.find(
        (u) => u.presenceId === presenceUser.userId
      );

      if (user?.role === "facilitator") {
        return null;
      }

      return {
        userId: presenceUser.userId,
        username: presenceUser.displayName,
        online: presenceUser.online,
        profileImage: presenceUser.profileImage,
        isOwner: user?.isOwner,
        role: user?.role,
      };
    })
    .filter((user) => user !== null);

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
        <div className="space-y-2">
          {roomUsers?.map((user) => (
            <UserCard
              key={user.userId}
              userId={user.userId}
              username={user.username}
              profileImage={user.profileImage}
              online={user.online}
              isOwner={user.isOwner}
              role={user.role}
            />
          ))}
        </div>
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
