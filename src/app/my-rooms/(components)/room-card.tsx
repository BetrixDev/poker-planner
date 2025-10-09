"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
import {
  Trash2Icon,
  PencilIcon,
  ListIcon,
  ExternalLinkIcon,
  UsersIcon,
  LockIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type Room = {
  _id: Id<"rooms">;
  _creationTime: number;
  code: string;
  password?: string;
  name: string;
  facilitatorIds: string[];
  ownerId: string;
  status: "votingActive" | "votesRevealed";
  currentIssueId?: Id<"issues">;
  settings: {};
  users: Array<{
    presenceId: string;
    displayName: string;
    isSpectator: boolean;
  }>;
};

export function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(room.name);
  const [copied, setCopied] = useState(false);

  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const renameRoom = useMutation(api.rooms.renameRoom);

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

      <CardFooter className="flex flex-wrap gap-2">
        <Link className="flex-1" href={`/room/${room._id}`} prefetch="auto">
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

        <Link href={`/my-rooms/${room._id}/issues`} prefetch="auto">
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
