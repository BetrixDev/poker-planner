import type { ReactNode } from "react";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { Route } from "~/routes/room_.$roomId";

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left"
  | "very-top-left"
  | "very-top-right"
  | "very-bottom-left"
  | "very-bottom-right";

const POSITION_STYLES: Record<Position, string> = {
  "top-center": "col-start-3 row-start-1 justify-self-center self-end",
  "bottom-center": "col-start-3 row-start-3 justify-self-center self-start",
  right: "col-start-5 row-start-2 justify-self-start self-center",
  left: "col-start-1 row-start-2 justify-self-end self-center",
  "top-left": "col-start-2 row-start-1 justify-self-center self-end",
  "bottom-right": "col-start-4 row-start-3 justify-self-center self-start",
  "top-right": "col-start-4 row-start-1 justify-self-center self-end",
  "bottom-left": "col-start-2 row-start-3 justify-self-center self-start",
  "very-top-left": "col-start-1 row-start-1 justify-self-end self-end",
  "very-top-right": "col-start-5 row-start-1 justify-self-start self-end",
  "very-bottom-left": "col-start-1 row-start-3 justify-self-end self-start",
  "very-bottom-right": "col-start-5 row-start-3 justify-self-start self-start",
};

// Positions in order around the table
const AVAILABLE_POSITIONS = Object.keys(POSITION_STYLES) as Position[];

export type User = {
  id: string;
  name: string;
  profileImage: string;
  vote: number | null;
};

type UserWithPosition = User & {
  position: Position;
};

type UserCardProps = {
  user: UserWithPosition;
};

function UserCard({ user }: UserCardProps) {
  const { name, profileImage, vote, position } = user;

  // Determine layout direction based on position
  const isTopPosition = position.includes("top");
  const isLeftPosition =
    position === "left" ||
    position === "very-bottom-left" ||
    position === "very-top-left";
  const isRightPosition =
    position === "right" ||
    position === "very-bottom-right" ||
    position === "very-top-right";

  const userInfo = (
    <div className="flex flex-col items-center gap-1">
      <img
        src={profileImage}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/75 to-primary/50 flex items-center justify-center text-2xl shadow-md"
      />
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );

  const hasVoted = vote !== null;
  const card = hasVoted ? (
    <Card
      className={`w-16 h-20 rounded-lg shadow-lg flex items-center justify-center transition-colors ${
        hasVoted
          ? "bg-primary/75 hover:bg-primary/50"
          : "bg-secondary hover:bg-secondary/80"
      }`}
    >
      <div className="text-primary-foreground text-2xl font-bold">
        {hasVoted ? vote : null}
      </div>
    </Card>
  ) : (
    <Skeleton className="w-16 h-20 rounded-lg border flex items-center justify-center">
      <Spinner />
    </Skeleton>
  );

  // For left/right positions, use horizontal layout
  if (isLeftPosition || isRightPosition) {
    return (
      <div
        className={`flex items-center gap-3 ${
          POSITION_STYLES[position as keyof typeof POSITION_STYLES]
        }`}
      >
        {isLeftPosition ? (
          <>
            {userInfo}
            {card}
          </>
        ) : (
          <>
            {card}
            {userInfo}
          </>
        )}
      </div>
    );
  }

  // For top/bottom positions, use vertical layout
  return (
    <div
      className={`flex flex-col items-center gap-2 ${
        POSITION_STYLES[position as keyof typeof POSITION_STYLES]
      }`}
    >
      {isTopPosition ? (
        <>
          {userInfo}
          {card}
        </>
      ) : (
        <>
          {card}
          {userInfo}
        </>
      )}
    </div>
  );
}

export function Room() {
  const { roomId } = Route.useParams();

  const roomData = useQuery(api.rooms.getRoomById, {
    id: roomId as Id<"rooms">,
  });

  const presence =
    useQuery(api.presence.list, {
      roomToken: roomData?.room?._id ?? "",
    }) ?? [];

  // Map presence data to User type
  const users: User[] = presence
    .filter((presenceUser) => {
      // Only show online users
      if (!presenceUser.online) return false;

      const roomUser = roomData?.room?.users?.find(
        (u) => u.presenceId === presenceUser.userId
      );

      // Filter out facilitators and spectators
      if (
        !roomUser ||
        roomUser.role === "facilitator" ||
        roomUser.role === "spectator"
      ) {
        return false;
      }

      return true;
    })
    .map((presenceUser) => {
      const roomUser = roomData?.room?.users?.find(
        (u) => u.presenceId === presenceUser.userId
      );

      return {
        id: presenceUser.userId,
        name: presenceUser.displayName,
        profileImage: presenceUser.profileImage,
        vote: roomUser?.currentVote ?? null,
      };
    });

  // Automatically assign positions to users
  const usersWithPositions: UserWithPosition[] = users.map((user, index) => ({
    ...user,
    position: AVAILABLE_POSITIONS[index % AVAILABLE_POSITIONS.length],
  }));

  // Group users by position type for rendering
  const topUsers = usersWithPositions.filter((u) => u.position.includes("top"));
  const bottomUsers = usersWithPositions.filter((u) =>
    u.position.includes("bottom")
  );
  const leftUser = usersWithPositions.find((u) => u.position === "left");
  const rightUser = usersWithPositions.find((u) => u.position === "right");

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8">
      {/* Grid layout for users around the table */}
      <div className="grid grid-cols-5 grid-rows-3 gap-6 min-h-[600px]">
        {/* Top row users */}
        {topUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}

        {/* Left side user */}
        {leftUser && <UserCard key={leftUser.id} user={leftUser} />}

        {/* Center table area */}
        <div className="col-start-2 col-span-3 row-start-2 flex items-center justify-center px-12">
          <div className="w-full max-w-md h-64 bg-[url('/assets/table-1.jpg')] bg-cover bg-center rounded-full border-8 border-background/50 outline-accent shadow-xl flex items-center justify-center relative z-10">
            <Button
              variant="outline"
              size="lg"
              className="text-lg font-semibold h-12 rounded-full z-10"
            >
              Reveal cards
            </Button>
            <div className="inset-0 absolute rounded-full [box-shadow:0_0_200px_rgba(0,0,0,1)_inset]" />
          </div>
          <div className="w-full max-w-md h-64 bg-background absolute rounded-full scale-[101%]" />
        </div>

        {/* Right side user */}
        {rightUser && <UserCard key={rightUser.id} user={rightUser} />}

        {/* Bottom row users */}
        {bottomUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
