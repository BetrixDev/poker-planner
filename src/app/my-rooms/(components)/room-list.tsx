"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "~/convex/_generated/api";
import { RoomCard } from "./room-card";
import { Button } from "~/components/ui/button";
import { PlusIcon, LayoutGridIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RoomList({
  preloadedRooms,
}: {
  preloadedRooms: Preloaded<typeof api.rooms.listRoomsForUser>;
}) {
  const router = useRouter();
  const { rooms } = usePreloadedQuery(preloadedRooms);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <LayoutGridIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">My Rooms</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your poker planning rooms
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => router.push("/room")}
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <PlusIcon className="h-5 w-5" />
              Create New Room
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {rooms.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </div>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {rooms.filter((r) => r.users.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Rooms</div>
          </div>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {rooms.reduce((sum, r) => sum + r.users.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="p-6 bg-muted/50 rounded-full mb-6">
              <LayoutGridIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No rooms yet</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first poker planning room. Invite
              your team and start estimating!
            </p>
            <Link href="/room?tab=create">
              <Button size="lg" className="gap-2">
                <PlusIcon className="h-5 w-5" />
                Create Your First Room
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
