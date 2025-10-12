import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LayoutGridIcon,
  ListIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/my-rooms")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.userId === undefined) {
      throw redirect({
        to: "/auth/$authView",
        params: { authView: "sign-in" },
        search: { redirectTo: "/my-rooms" },
      });
    }
  },
});

function RouteComponent() {
  const router = useRouter();

  const { isPending: isSessionPending } = authClient.useSession();

  const { data: rooms } = useQuery({
    ...convexQuery(api.rooms.listRoomsForUser, {}),
    enabled: !isSessionPending,
  });

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
              onClick={() =>
                router.navigate({ to: "/room", search: { tab: "create" } })
              }
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
              {rooms?.length ?? <Skeleton className="w-12 h-8" />}
            </div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </div>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {rooms?.filter((r) => r.users.length > 0).length ?? (
                <Skeleton className="w-12 h-8" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">Active Rooms</div>
          </div>
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {rooms?.reduce((sum, r) => sum + r.users.length, 0) ?? (
                <Skeleton className="w-12 h-8" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
        </div>

        {/* Rooms Grid */}
        {rooms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="p-6 bg-muted/50 rounded-full mb-6">
              <LayoutGridIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No rooms yet</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first poker planning room. Invite
              your team and start estimating!
            </p>
            <Link to="/room" search={{ tab: "create" }}>
              <Button size="lg" className="gap-2">
                <PlusIcon className="h-5 w-5" />
                Create Your First Room
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms?.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type Room = (typeof api.rooms.listRoomsForUser._returnType)[number];

function RoomCard({ room }: { room: Room }) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(room.name);
  const [copied, setCopied] = useState(false);

  const { mutateAsync: deleteRoom } = useMutation({
    mutationFn: useConvexMutation(api.rooms.deleteRoom),
  });
  const { mutateAsync: renameRoom } = useMutation({
    mutationFn: useConvexMutation(api.rooms.renameRoom),
  });

  const handleDelete = async () => {
    try {
      await deleteRoom({ id: room._id });
      toast.success("Room deleted successfully");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete room");
      console.error(error);
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error("Room name cannot be empty");
      return;
    }
    try {
      await renameRoom({ id: room._id, name: newName });
      toast.success("Room renamed successfully");
      setIsRenameOpen(false);
    } catch (error) {
      toast.error("Failed to rename room");
      console.error(error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    toast.success("Room code copied to clipboard", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          {room.name}
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {room.code}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopyCode}
              className="h-6 w-6"
            >
              {copied ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <CopyIcon className="h-3 w-3" />
              )}
            </Button>
            {room.password && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <LockIcon className="h-3 w-3" />
                Password
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <UsersIcon className="h-3 w-3" />
              {room.users.length} active
            </span>
            <span className="flex items-center gap-1">
              Status:{" "}
              {room.status === "votingActive" ? "🟢 Active" : "🔵 Revealed"}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground">
          Created {new Date(room._creationTime).toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 text-foreground">
        <Link
          className="flex-1"
          to="/room/$roomId"
          params={{ roomId: room._id }}
          preload="intent"
        >
          <Button variant="default" size="sm" className="w-full">
            <ExternalLinkIcon className="h-4 w-4" />
            Open Room
          </Button>
        </Link>

        <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Room</DialogTitle>
              <DialogDescription>
                Enter a new name for your room.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter room name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link
          to="/my-rooms/$roomId/issues"
          params={{ roomId: room._id }}
          preload="intent"
        >
          <Button variant="outline" size="icon-sm">
            <ListIcon className="h-4 w-4" />
          </Button>
        </Link>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon-sm">
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{room.name}"? This action
                cannot be undone and will delete all associated issues and
                votes.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
