import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "~/components/ui/dialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";

export function Issues() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Issues</SidebarGroupLabel>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarGroupAction>
            <PlusIcon /> <span className="sr-only">Add Issue</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <AddIssueDialogContent />
      </Dialog>
      <SidebarGroupContent></SidebarGroupContent>
    </SidebarGroup>
  );
}

function AddIssueDialogContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Issue</DialogTitle>
      </DialogHeader>
    </DialogContent>
  );
}
