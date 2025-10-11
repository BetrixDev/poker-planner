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
  { id: "7", name: "Taylor", icon: "👩‍🏫", vote: 5 },
  { id: "8", name: "Brandon", icon: "👨‍🚀", vote: 89 },
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
    <div className="min-h-screen w-full flex bg-background p-8">
      <Table roomId={roomId} presenceId={presenceId} users={FAKE_USERS} />
      <div className="w-screen pointer-events-none min-h-[calc(100vh-3rem)] absolute flex items-end justify-center">
        <VotingDock />
      </div>
    </div>
  );
}
