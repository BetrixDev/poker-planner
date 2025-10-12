import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  PlusIcon,
  ArrowLeftIcon,
  ListIcon,
  Trash2Icon,
  PencilIcon,
  CheckCircle2Icon,
  CircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Route } from "~/routes/my-rooms_.$roomId.issues";
import { Link } from "@tanstack/react-router";
import { RainbowButton } from "~/components/ui/rainbow-button";

export function IssueManager() {
  const { roomId } = Route.useParams();

  const { data } = useQuery(
    convexQuery(api.rooms.getRoomById, { id: roomId as Id<"rooms"> })
  );

  const { room, issues } = data ?? {};

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Id<"issues"> | null>(null);

  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const createIssue = useMutation(api.issues.createIssue);
  const updateIssue = useMutation(api.issues.updateIssue);
  const deleteIssue = useMutation(api.issues.deleteIssue);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Room not found</h2>
          <Link to="/my-rooms">
            <Button>Back to My Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateIssue = async () => {
    if (!newIssueTitle.trim()) {
      toast.error("Issue title cannot be empty");
      return;
    }
    try {
      await createIssue({
        roomId: room._id,
        title: newIssueTitle,
        description: newIssueDescription || undefined,
      });
      toast.success("Issue created successfully");
      setNewIssueTitle("");
      setNewIssueDescription("");
      setIsCreateOpen(false);
    } catch (error) {
      toast.error("Failed to create issue");
      console.error(error);
    }
  };

  const handleEditIssue = async () => {
    if (!selectedIssue) return;
    if (!editTitle.trim()) {
      toast.error("Issue title cannot be empty");
      return;
    }
    try {
      await updateIssue({
        id: selectedIssue,
        title: editTitle,
        description: editDescription || undefined,
      });
      toast.success("Issue updated successfully");
      setIsEditOpen(false);
      setSelectedIssue(null);
    } catch (error) {
      toast.error("Failed to update issue");
      console.error(error);
    }
  };

  const handleDeleteIssue = async () => {
    if (!selectedIssue) return;
    try {
      await deleteIssue({ id: selectedIssue });
      toast.success("Issue deleted successfully");
      setIsDeleteOpen(false);
      setSelectedIssue(null);
    } catch (error) {
      toast.error("Failed to delete issue");
      console.error(error);
    }
  };

  const openEditDialog = (issue: any) => {
    setSelectedIssue(issue._id);
    setEditTitle(issue.title);
    setEditDescription(issue.description || "");
    setIsEditOpen(true);
  };

  const openDeleteDialog = (issueId: Id<"issues">) => {
    setSelectedIssue(issueId);
    setIsDeleteOpen(true);
  };

  const sortedIssues = [...(issues ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/my-rooms">
            <Button variant="ghost" className="mb-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to My Rooms
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ListIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  {room.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage issues for this room
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <RainbowButton className="gap-2 shadow-lg hover:shadow-xl transition-all">
                    <PlusIcon className="h-5 w-5" />
                    AI Issue Ingestion
                  </RainbowButton>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>AI Issue Ingestion</DialogTitle>
                    <DialogDescription>
                      Upload a screenshot of your issues from any provider and
                      we'll parse them for you.
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button>Begin Ingestion</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create Issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Issue</DialogTitle>
                    <DialogDescription>
                      Add a new issue to estimate in this room.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newIssueTitle}
                        onChange={(e) => setNewIssueTitle(e.target.value)}
                        placeholder="Enter issue title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newIssueDescription}
                        onChange={(e) => setNewIssueDescription(e.target.value)}
                        placeholder="Enter issue description (optional)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateOpen(false);
                        setNewIssueTitle("");
                        setNewIssueDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateIssue}>Create Issue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Room Info */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-muted-foreground">
              {issues?.length} issue{issues?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Issues List */}
        {sortedIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="p-6 bg-muted/50 rounded-full mb-6">
              <ListIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No issues yet</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first issue to start estimating with your team.
            </p>
            <Button
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Issue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedIssues.map((issue) => (
              <Card
                key={issue._id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {issue.isCompleted ? (
                        <CheckCircle2Icon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <CircleIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        {issue.description && (
                          <CardDescription className="mt-1">
                            {issue.description}
                          </CardDescription>
                        )}
                        {issue.finalEstimate && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Estimate: {issue.finalEstimate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(issue)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openDeleteDialog(issue._id)}
                      >
                        <Trash2Icon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Issue</DialogTitle>
              <DialogDescription>Update the issue details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter issue title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter issue description (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedIssue(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditIssue}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Issue</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this issue? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedIssue(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteIssue}>
                Delete Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
