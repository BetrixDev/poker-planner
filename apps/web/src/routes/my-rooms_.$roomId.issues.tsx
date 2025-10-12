import { createFileRoute } from "@tanstack/react-router";
import { IssueManager } from "~/components/my-rooms/room/issues/issue-manager";

export const Route = createFileRoute("/my-rooms_/$roomId/issues")({
  component: RouteComponent,
});

function RouteComponent() {
  return <IssueManager />;
}
