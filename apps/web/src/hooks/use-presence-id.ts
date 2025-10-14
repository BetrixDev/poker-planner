import { authClient } from "~/lib/auth-client";
import { nanoid } from "nanoid";

export function usePresenceId() {
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();

  if (sessionData?.user) {
    return sessionData.user.id;
  }

  if (isSessionPending) {
    return null;
  }

  const localStoragePresenceId = localStorage.getItem("presenceId");

  if (
    localStoragePresenceId &&
    localStoragePresenceId.startsWith("anon_") &&
    localStoragePresenceId.length === 15
  ) {
    return localStoragePresenceId;
  }

  const presenceId = nanoid(10);

  localStorage.setItem("presenceId", `anon_${presenceId}`);

  return presenceId;
}
