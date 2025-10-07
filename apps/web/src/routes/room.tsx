import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/room")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/join-room"!</div>;
}
