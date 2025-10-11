import { cookies } from "next/headers";
import { Table, User } from "./(components)/table";
import { getToken } from "~/lib/auth-server";
import { api } from "~/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { VotingDock } from "./(components)/voting-dock";

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
    <div className="min-h-screen w-full flex bg-[url('/assets/room-1.jpg')] bg-repeat bg-center p-8">
      <Table roomId={roomId} presenceId={presenceId} users={FAKE_USERS} />
      <div className="fixed bottom-4 left-0 w-screen pointer-events-none flex items-end justify-center z-50">
        <VotingDock />
      </div>
    </div>
  );
}
