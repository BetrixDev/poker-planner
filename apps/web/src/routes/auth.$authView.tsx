import { cn } from "~/lib/utils";
import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/$authView")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authView } = Route.useParams();

  return (
    <main className="h-screen flex items-center justify-center w-screen">
      <div className="w-[500px]">
        <AuthView pathname={authView} />
      </div>
    </main>
  );
}
