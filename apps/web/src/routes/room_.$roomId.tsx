import { RoomSidebar } from "@/components/room/room-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@poker-planner/backend/convex/_generated/api";
import type { Id } from "@poker-planner/backend/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/room_/$roomId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.rooms.getRoomById, { id: params.roomId as Id<"rooms"> })
    );
  },
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  const { data: roomData } = useQuery(
    convexQuery(api.rooms.getRoomById, { id: roomId as Id<"rooms"> })
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <RoomSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link to="/">
                  <BreadcrumbLink>Homepage</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <Link to="/room">
                <BreadcrumbLink>Rooms</BreadcrumbLink>
              </Link>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <Link to="/room/$roomId" params={{ roomId }}>
                  <BreadcrumbPage>{roomData?.room?.name}</BreadcrumbPage>
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div>body</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
