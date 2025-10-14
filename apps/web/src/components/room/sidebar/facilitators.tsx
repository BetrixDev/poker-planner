import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
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
import { Route } from "~/routes/room_.$roomId";
import { User2Icon } from "lucide-react";
import { UserCard } from "./user-card";

export function Facilitators() {
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

  const roomFacilitators = presence
    .map((presenceUser) => {
      const user = roomData.room?.users?.find(
        (u) => u.presenceId === presenceUser.userId
      );

      if (!user || user.role !== "facilitator") {
        return null;
      }

      return {
        userId: presenceUser.userId,
        username: user.displayName ?? "Unknown",
        online: presenceUser.online,
        profileImage: user.profileImage,
        isOwner: user.isOwner,
      };
    })
    .filter((user) => user !== null);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Facilitators</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <User2Icon /> <span className="sr-only">Add Facilitator</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <AddFacilitatorDialogContent />
      </Dialog>
      <SidebarGroupContent>
        <div className="space-y-2">
          {roomFacilitators.map((facilitator) => (
            <UserCard
              key={facilitator.userId}
              userId={facilitator.userId}
              username={facilitator.username}
              profileImage={facilitator.profileImage}
              online={facilitator.online}
              isOwner={facilitator.isOwner}
            />
          ))}
        </div>
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
