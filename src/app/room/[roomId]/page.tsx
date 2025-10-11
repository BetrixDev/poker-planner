import { cookies } from "next/headers";
import { Table, User } from "./(components)/table";
import { getToken } from "~/lib/auth-server";
import { api } from "~/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { VotingDock } from "./(components)/voting-dock";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { RoomSidebar } from "./(components)/room-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

// Temporary fake users for testing
const FAKE_USERS: User[] = [
  { id: "1", name: "Sara", icon: "🧑‍💼", vote: null },
  { id: "2", name: "Jennifer", icon: "👩‍💻", vote: 5 },
  { id: "3", name: "Michael", icon: "👨‍💼", vote: 8 },
  { id: "4", name: "Alex", icon: "👨‍🔬", vote: null },
  { id: "5", name: "Sam", icon: "👩‍🎨", vote: 3 },
  { id: "6", name: "Jordan", icon: "🧑‍🎓", vote: null },
  { id: "7", name: "Chris", icon: "🧑‍🍳", vote: 13 },
  { id: "8", name: "Megan", icon: "👩‍🚒", vote: 2 },
  { id: "9", name: "Liam", icon: "🧑‍🔧", vote: 0 },
  { id: "10", name: "Olivia", icon: "👨‍🎤", vote: 21 },
  { id: "11", name: "Noah", icon: "👩‍🚀", vote: 5 },
  { id: "12", name: "Emma", icon: "🧑‍🔬", vote: null },
];

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;

  const cookieStore = await cookies();

  let presenceId = cookieStore.get("roomPresenceId")?.value;

  if (!presenceId) {
    const token = await getToken();

    let userId: string | undefined = undefined;

    try {
      const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });

      userId = user._id ?? undefined;
    } catch {}

    if (!userId) {
      redirect(`/auth/sign-in?redirectTo=/room/${roomId}`);
    }

    presenceId = userId;
  }

  return (
    <SidebarProvider>
      <RoomSidebar />
      <SidebarInset className="bg-[url('/assets/room-1.jpg')] bg-repeat bg-center relative">
        <header className="absolute flex h-16 shrink-0 items-center gap-2 bg-background/75 rounded-xl rounded-b-none backdrop-blue-md w-full">
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
        </header>
        <div>
          <Table roomId={roomId} presenceId={presenceId} users={FAKE_USERS} />
          <VotingDock />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
