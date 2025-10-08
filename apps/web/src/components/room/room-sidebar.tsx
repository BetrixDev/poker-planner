import * as React from "react";
import { GalleryVerticalEnd, UserRoundPlusIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "@tanstack/react-form";
import { Route } from "@/routes/room_.$roomId";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import type { ConvexError } from "convex/values";

export function RoomSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <span className="font-medium">Poker Planner</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <RoomIssues />
      </SidebarContent>
      <SidebarFooter>
        <InviteUserButton />
        <DeleteRoomButton />
      </SidebarFooter>
    </Sidebar>
  );
}

function InviteUserButton() {
  const { roomId } = Route.useParams();

  const { data } = useQuery(
    convexQuery(api.rooms.getRoomById, {
      id: roomId as Id<"rooms">,
    })
  );

  return (
    <Button
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(data?.room?.inviteLink ?? "");
        toast.success("Invite link copied to clipboard");
      }}
    >
      <UserRoundPlusIcon /> Copy Invite Link
    </Button>
  );
}

function DeleteRoomButton() {
  const { roomId } = Route.useParams();

  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.rooms.deleteRoom),
    onSuccess: () => {
      toast.success("Room deleted");
      setIsDeleteRoomOpen(false);
    },
    onError: (error: ConvexError<any>) => {
      toast.error(error.data ?? error.message);
    },
  });

  return (
    <Dialog open={isDeleteRoomOpen} onOpenChange={setIsDeleteRoomOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this room? All issues and votes will
            be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => mutate({ id: roomId as Id<"rooms"> })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

function RoomIssues() {
  const { roomId } = Route.useParams();

  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.issues.createIssue),
    onSuccess: () => {
      setIsCreateIssueOpen(false);
    },
    onError: (error: ConvexError<any>) => {
      toast.error(error.data ?? error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onDynamic: createIssueSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      mutate({
        roomId: roomId as Id<"rooms">,
        title: value.title,
        description: value.description,
      });
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Issues</SidebarGroupLabel>
      <Dialog open={isCreateIssueOpen} onOpenChange={setIsCreateIssueOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Add an Issue
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an Issue</DialogTitle>
            <DialogDescription>
              Add issues to keep track of voting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Issue title"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="error">
                      {field.state.meta.errors[0]?.message}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Description</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Issue description"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="error">
                      {field.state.meta.errors[0]?.message}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter className="flex flex-col">
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={() => form.handleSubmit()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
