import { Button } from "@/components/ui/button";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/join/$inviteCode")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const room = await context.queryClient.ensureQueryData(
      convexQuery(api.rooms.getRoomByInviteCode, {
        code: params.inviteCode,
      })
    );

    if (!room) {
      throw notFound();
    }

    if (room) {
      throw redirect({
        to: "/room/$roomId",
        params: { roomId: room._id },
        replace: true,
      });
    }
  },
  notFoundComponent: () => (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1>Room not found</h1>
      <div className="flex gap-2">
        <Link to="/">
          <Button size="sm" variant="outline">
            Go Home
          </Button>
        </Link>
        <Link to="/room" search={{ tab: "create" }}>
          <Button size="sm" variant="outline">
            Create a Room
          </Button>
        </Link>
      </div>
    </div>
  ),
});

function RouteComponent() {
  return <div></div>;
}
