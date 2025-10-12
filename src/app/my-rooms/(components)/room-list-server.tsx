import { preloadQuery } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { RoomList } from "./room-list";

export async function RoomListServer() {
  const token = await getToken();

  const preloadedRooms = await preloadQuery(
    api.rooms.listRoomsForUser,
    {},
    { token }
  );

  return <RoomList preloadedRooms={preloadedRooms} />;
}
