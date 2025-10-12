import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "~/convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { RoomList } from "./(components)/room-list";
import { Suspense } from "react";
import { RoomListServer } from "./(components)/room-list-server";

export default async function Page() {
  const token = await getToken();

  if (!token) {
    redirect("/auth/sign-in?redirectTo=/my-rooms");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomListServer />
    </Suspense>
  );
}
