import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ConvexError } from "convex/values";
import {
  PlusIcon,
  Trash2Icon,
  ListTodoIcon,
  PencilLineIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "~/components/kibo-ui/dropzone";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { Route } from "~/routes/room_.$roomId";

export function Issues() {
  const { roomId } = Route.useParams();

  const { data } = useQuery(
    convexQuery(api.issues.getIssues, { roomId: roomId as Id<"rooms"> })
  );

  const sortedIssues = data?.sort((a, b) => a.order - b.order) || [];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Issues</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <PlusIcon /> <span className="sr-only">Add Issue</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <AddIssueDialogContent roomId={roomId as Id<"rooms">} />
      </Dialog>
      <SidebarGroupContent className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full rounded-full" variant="outline" size="sm">
              AI Issue Ingestion
            </Button>
          </DialogTrigger>
          <IngestIssuesDialogContent roomId={roomId as Id<"rooms">} />
        </Dialog>
        {sortedIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <ListTodoIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No issues yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first issue to get started
            </p>
          </div>
        ) : (
          sortedIssues.map((issue, index) => {
            return (
              <div
                key={issue._id}
                className="group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="flex items-start gap-3">
                  {/* Issue Number Badge */}
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </div>

                  {/* Issue Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 break-words">
                      {issue.title}
                    </h3>
                    {issue.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {issue.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 hover:bg-primary/10 hover:text-primary"
                        >
                          <PencilLineIcon className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <EditIssueDialogContent
                        issueId={issue._id}
                        issueTitle={issue.title}
                        issueDescription={issue.description || ""}
                      />
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DeleteIssueDialogContent
                        issueTitle={issue.title}
                        issueId={issue._id}
                      />
                    </Dialog>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

type IngestIssuesDialogContentProps = {
  roomId: Id<"rooms">;
};

function IngestIssuesDialogContent({ roomId }: IngestIssuesDialogContentProps) {
  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = (files: File[]) => {
    setFiles(files);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ingest Issues</DialogTitle>
        <DialogDescription>
          <div>
            Upload a screenshot of your issues from any provider and we'll parse
            them for you.
          </div>
          <div>Any issues found will be added to the issue list.</div>
        </DialogDescription>
      </DialogHeader>
      <Dropzone
        accept={{ "image/*": [] }}
        maxFiles={10}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <p className="text-xs text-muted-foreground">
        By clicking "Begin Ingestion", you agree to the{" "}
        <Link to="/terms">Terms of Service</Link> and{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={() => setFiles(undefined)}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button>Begin Ingestion</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

type AddIssueDialogContentProps = {
  roomId: Id<"rooms">;
};

function AddIssueDialogContent({ roomId }: AddIssueDialogContentProps) {
  const { mutate: updateIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.createIssue),
    onSuccess: () => {
      toast.success("Issue updated successfully");
    },
    onError: (error) => {
      if (error instanceof ConvexError) {
        toast.error(error.data);
      } else {
        toast.error("Failed to update issue");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      updateIssue({
        roomId: roomId,
        title: value.title,
        description: value.description,
      });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Issue</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <form.Field
          name="title"
          validators={{
            onBlur: z.string().min(1, "Title is required"),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter issue title"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter issue description"
              />
            </div>
          )}
        </form.Field>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
        </DialogClose>
        <form.Subscribe selector={(s) => s.isValid && s.isDirty}>
          {(state) => (
            <DialogClose asChild>
              <Button disabled={!state} onClick={form.handleSubmit}>
                Add Issue
              </Button>
            </DialogClose>
          )}
        </form.Subscribe>
      </DialogFooter>
    </DialogContent>
  );
}

type EditIssueDialogContentProps = {
  issueId: Id<"issues">;
  issueTitle: string;
  issueDescription: string;
};

function EditIssueDialogContent({
  issueTitle,
  issueDescription,
  issueId,
}: EditIssueDialogContentProps) {
  const { mutate: updateIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.updateIssue),
    onSuccess: () => {
      toast.success("Issue updated successfully");
    },
    onError: (error) => {
      if (error instanceof ConvexError) {
        toast.error(error.data);
      } else {
        toast.error("Failed to update issue");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      title: issueTitle,
      description: issueDescription,
    },
    onSubmit: async ({ value }) => {
      updateIssue({
        id: issueId,
        title: value.title,
        description: value.description,
      });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Issue</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <form.Field
          name="title"
          validators={{
            onBlur: z.string().min(1, "Title is required"),
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter issue title"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter issue description"
              />
            </div>
          )}
        </form.Field>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <form.Subscribe selector={(s) => s.isValid && s.isDirty}>
          {(state) => (
            <DialogClose asChild>
              <Button disabled={!state} onClick={form.handleSubmit}>
                Save Changes
              </Button>
            </DialogClose>
          )}
        </form.Subscribe>
      </DialogFooter>
    </DialogContent>
  );
}

type DeleteIssueDialogContentProps = {
  issueTitle: string;
  issueId: Id<"issues">;
};

function DeleteIssueDialogContent({
  issueTitle,
  issueId,
}: DeleteIssueDialogContentProps) {
  const { mutate: deleteIssue } = useMutation({
    mutationFn: useConvexMutation(api.issues.deleteIssue),
    onSuccess: () => {
      toast.success("Issue deleted successfully");
    },
    onError: (error) => {
      if (error instanceof ConvexError) {
        toast.error(error.data);
      } else {
        toast.error("Failed to delete issue");
      }
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Issue "{issueTitle}"</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this issue? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="destructive"
            onClick={() => deleteIssue({ id: issueId })}
          >
            Delete Issue
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
