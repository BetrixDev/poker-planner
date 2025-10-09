"use client";

import usePresence from "@convex-dev/presence/react";
import { api } from "~/convex/_generated/api";
import { authClient } from "~/lib/auth-client";

type TableProps = {
  roomId: string;
  presenceId: string;
};

export function Table({ roomId, presenceId }: TableProps) {
  const user = authClient.useSession();

  const presence = usePresence(api.presence, roomId, presenceId) ?? [];

  return <div className="w-96 h-96 bg-red-500 rounded-full"></div>;
}
