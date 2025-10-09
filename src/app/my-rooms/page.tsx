import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { RoomList } from "./(components)/room-list";

export default async function Page() {
  const token = await getToken();

  try {
    await fetchQuery(api.auth.getCurrentUser, {}, { token });
  } catch {
    redirect("/auth/sign-in?redirectTo=/my-rooms");
  }

  const preloadedRooms = await preloadQuery(
    api.rooms.listRoomsForUser,
    {},
    { token }
  );

  return <RoomList preloadedRooms={preloadedRooms} />;
}
