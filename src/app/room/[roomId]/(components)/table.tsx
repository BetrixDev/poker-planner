"use client";

import { ReactNode } from "react";
import usePresence from "@convex-dev/presence/react";
import { api } from "~/convex/_generated/api";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left";

// Positions in order around the table
const AVAILABLE_POSITIONS: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "right",
  "bottom-right",
  "bottom-center",
  "bottom-left",
  "left",
];

export type User = {
  id: string;
  name: string;
  icon: ReactNode;
  vote: number | null;
};

type TableProps = {
  roomId: string;
  presenceId: string;
  users: User[];
};

type UserWithPosition = User & {
  position: Position;
};

type UserCardProps = {
  user: UserWithPosition;
};

function UserCard({ user }: UserCardProps) {
  const { name, icon, vote, position } = user;

  const positionStyles = {
    "top-center": "col-start-3 row-start-1 justify-self-center self-end",
    "bottom-center": "col-start-3 row-start-3 justify-self-center self-start",
    right: "col-start-5 row-start-2 justify-self-start self-center",
    left: "col-start-1 row-start-2 justify-self-end self-center",
    "top-left": "col-start-2 row-start-1 justify-self-center self-end",
    "bottom-right": "col-start-4 row-start-3 justify-self-center self-start",
    "top-right": "col-start-4 row-start-1 justify-self-center self-end",
    "bottom-left": "col-start-2 row-start-3 justify-self-center self-start",
  };

  // Determine layout direction based on position
  const isTopPosition = position.startsWith("top");
  const isBottomPosition = position.startsWith("bottom");
  const isLeftPosition = position === "left";
  const isRightPosition = position === "right";

  const userInfo = (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/75 to-primary/50 flex items-center justify-center text-2xl shadow-md">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );

  const hasVoted = vote !== null;
  const card = (
    <Card
      className={`w-16 h-20 rounded-lg shadow-md flex items-center justify-center transition-colors ${
        hasVoted
          ? "bg-primary/75 hover:bg-primary/50"
          : "bg-secondary hover:bg-secondary/80"
      }`}
    >
      <div className="text-primary-foreground text-2xl font-bold">
        {hasVoted ? vote : "?"}
      </div>
    </Card>
  );

  // For left/right positions, use horizontal layout
  if (isLeftPosition || isRightPosition) {
    return (
      <div
        className={`flex items-center gap-3 ${
          positionStyles[position as keyof typeof positionStyles]
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
        positionStyles[position as keyof typeof positionStyles]
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

export function Table({ roomId, presenceId, users }: TableProps) {
  const user = authClient.useSession();

  const presence = usePresence(api.presence, roomId, presenceId) ?? [];

  // Automatically assign positions to users
  const usersWithPositions: UserWithPosition[] = users.map((user, index) => ({
    ...user,
    position: AVAILABLE_POSITIONS[index % AVAILABLE_POSITIONS.length],
  }));

  // Group users by position type for rendering
  const topUsers = usersWithPositions.filter((u) =>
    u.position.startsWith("top")
  );
  const bottomUsers = usersWithPositions.filter((u) =>
    u.position.startsWith("bottom")
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
          <div className="w-full max-w-md h-64 bg-gradient-to-br from-accent/75 to-accent/50 rounded-full border-8 border-secondary outline-accent shadow-xl flex items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="text-lg font-semibold"
            >
              Reveal cards
            </Button>
          </div>
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
