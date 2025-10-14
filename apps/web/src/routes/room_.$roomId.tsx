import { api } from "@poker-planner/backend/convex/_generated/api";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Dock } from "~/components/room/dock";
import { Room } from "~/components/room/room";
import { RoomSidebar } from "~/components/room/sidebar/room-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { usePresenceId } from "~/hooks/use-presence-id";
import usePresence from "@convex-dev/presence/react";
import { UserButtons } from "~/components/header";

export const Route = createFileRoute("/room_/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ClientOnly>
        <PresenceWrapper />
      </ClientOnly>
      <SidebarProvider>
        <RoomSidebar />
        <SidebarInset className="bg-[url('/assets/room-1.jpg')] bg-repeat bg-center relative">
          <header className="absolute flex h-16 shrink-0 items-center justify-between gap-2 bg-background/75 rounded-xl rounded-b-none backdrop-blue-md w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/my-rooms">My Rooms</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Joe Room</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="px-3">
              <UserButtons muted />
            </div>
          </header>
          <div>
            <Room />
            <Dock />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

function PresenceWrapper() {
  const presenceId = usePresenceId();

  if (!presenceId) {
    return null;
  }

  return <Presence presenceId={presenceId} />;
}

function Presence({ presenceId }: { presenceId: string }) {
  const { roomId } = Route.useParams();

  usePresence(api.presence, roomId, presenceId);

  return null;
}
