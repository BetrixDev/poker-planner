import { cookies } from "next/headers";
import { Table } from "./(components)/table";
import { getToken } from "~/lib/auth-server";
import { api } from "~/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

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
    <div className="h-screen w-screen flex items-center justify-center">
      <Table roomId={roomId} presenceId={presenceId} />
    </div>
  );
}
