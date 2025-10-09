import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { IssueManager } from "./(components)/issue-manager";
import { Id } from "~/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const token = await getToken();
  const { roomId } = await params;

  try {
    await fetchQuery(api.auth.getCurrentUser, {}, { token });
  } catch {
    redirect(`/auth/sign-in?redirectTo=/my-rooms/${roomId}/issues`);
  }

  const preloadedRoomData = await preloadQuery(
    api.rooms.getRoomById,
    { id: roomId as Id<"rooms"> },
    { token }
  );

  return <IssueManager preloadedRoomData={preloadedRoomData} />;
}
