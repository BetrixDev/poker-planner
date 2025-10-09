"use client";

import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { api } from "~/convex/_generated/api";
import { z } from "zod/v4";
import { useForm } from "@tanstack/react-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { useConvex, useMutation } from "convex/react";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { AuthLoading, SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import Link from "next/link";

export default function Page() {
  const [tab, setTab] = useQueryState("tab");

  return (
    <main className="relative min-h-scree pb-24 pt-32 md:pt-40">
      <div className="pointer-events-none absolute top-24 right-10 hidden h-[28rem] w-[28rem] rounded-full bg-secondary/40 blur-3xl dark:bg-secondary/20 md:block" />
      <div className="pointer-events-none absolute bottom-10 left-10 hidden h-[24rem] w-[24rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/10 md:block" />

      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-green-500/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Plan your next estimation session
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            One hub to create or join your planning rooms
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Spin up a new room for your team or jump into an existing session
            using an invite code. Secure, fast, and perfectly in sync with your
            agile rituals.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
              Real-time collaboration
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />
              Free for small teams
            </div>
          </div>
        </div>

        <Card className="mx-auto mt-12 max-w-4xl border-border/80 bg-background/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-0 text-center">
            <CardTitle className="text-2xl font-semibold">
              Create or join a room
            </CardTitle>
            <CardDescription>
              Choose how you want to start collaborating with your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs
              value={tab ?? "create"}
              onValueChange={(value) => setTab(value as "create" | "join")}
            >
              <TabsList className="mx-auto mb-8 grid w-full max-w-lg grid-cols-2">
                <TabsTrigger value="create">Create a room</TabsTrigger>
                <TabsTrigger value="join">Join a room</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-8">
                <CreateRoomForm />
              </TabsContent>

              <TabsContent value="join" className="space-y-8">
                <JoinRoomForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-border/80 bg-background/80 p-6 text-left shadow-sm"
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full",
                  benefit.color
                )}
              >
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-8 text-center">
          <p className="text-base font-medium text-muted-foreground">
            Have an invite link instead?
          </p>
          <Button variant="outline" className="gap-2" disabled>
            <Link href={`/join/${""}`}>Paste invite code URL</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

type CreateRoomFormValues = {
  name: string;
  password?: string;
};

function CreateRoomForm() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);

  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
    } satisfies CreateRoomFormValues,
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Room name must be at least 2 characters"),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      const roomId = await createRoom({
        name: value.name,
        password: value.password?.length ? value.password : undefined,
      });

      router.push(`/room/${roomId}`);

      toast.success("Room created successfully");
    },
  });

  return (
    <>
      <AuthLoading>Loading...</AuthLoading>
      <SignedOut>
        <Card className="flex flex-col gap-4 items-center justify-center">
          <CardHeader className="text-center w-full">
            <CardDescription>
              You must be signed in to create a room
            </CardDescription>
          </CardHeader>
          {/* <Button
            className="w-1/2"
            variant="outline"
            onClick={async () => {
              const result = await authClient.signIn.anonymous();

              if (result.data) {
                toast.success("Anonymous sign in successful", {
                  description: `Name: ${result.data.user.name}`,
                });
              } else {
                toast.error("Failed to sign in");
              }
            }}
          >
            Anonymous Sign In
          </Button> */}
          <Link
            href={`/auth/sign-in?redirectTo=${encodeURIComponent(
              "/room?tab=create"
            )}`}
            className="w-full flex justify-center"
          >
            <Button className="w-1/2" variant="outline">
              Sign In Page
            </Button>
          </Link>
        </Card>
      </SignedOut>
      <SignedIn>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="mx-auto w-full max-w-2xl space-y-8"
        >
          <FieldSet>
            <FieldLegend className="text-left text-lg font-semibold text-foreground">
              Create a room
            </FieldLegend>
            <FieldDescription className="text-left">
              Give your room a recognizable name and optionally protect it with
              a password.
            </FieldDescription>
            <FieldGroup>
              <form.Field
                name="name"
                validators={{
                  onBlur: z
                    .string()
                    .min(2, "Room name must be at least 2 characters"),
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Room name</FieldLabel>
                    <Input
                      placeholder="Sprint planning session"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldDescription>
                      Use something your team will recognize instantly.
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel>Room password</FieldLabel>
                    <Input
                      placeholder="Optional password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldDescription>
                      Add a password for private sessions (optional).
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  className="w-full sm:w-fit"
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? "Creating room..." : "Create room"}
                </Button>
              )}
            </form.Subscribe>
          </FieldSet>
        </form>
      </SignedIn>
    </>
  );
}

type JoinRoomFormValues = {
  code: string;
  password?: string;
};

function JoinRoomForm() {
  const router = useRouter();
  const convex = useConvex();

  const form = useForm({
    defaultValues: {
      code: "",
      password: "",
    } satisfies JoinRoomFormValues,
    validators: {
      onSubmit: z.object({
        code: z
          .string()
          .min(6, "Enter a valid 6-character code")
          .max(6, "Code must be 6 characters"),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      const normalizedCode = value.code.trim().toUpperCase();

      const roomId = await convex.query(
        api.rooms.getRoomByJoinCodeAndPassword,
        {
          code: normalizedCode,
          password: value.password?.length ? value.password : undefined,
        }
      );

      if (!roomId) {
        toast.error("Room not found or incorrect password");
        return;
      }

      router.push(`/room/${roomId}`);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto w-full max-w-2xl space-y-8"
    >
      <FieldSet>
        <FieldLegend className="text-left text-lg font-semibold text-foreground">
          Join a room
        </FieldLegend>
        <FieldDescription className="text-left">
          Enter the 6-character invite code shared by your facilitator.
        </FieldDescription>
        <FieldGroup>
          <form.Field name="code">
            {(field) => (
              <Field>
                <FieldLabel>Invite code</FieldLabel>
                <Input
                  placeholder="ABC123"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  maxLength={6}
                />
                <FieldDescription>
                  You can find this in the invite link or from your facilitator.
                </FieldDescription>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel>Room password</FieldLabel>
                <Input
                  placeholder="Leave blank if not required"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>
                  Only needed for password-protected rooms.
                </FieldDescription>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>
        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full sm:w-fit"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Joining..." : "Join room"}
            </Button>
          )}
        </form.Subscribe>
      </FieldSet>
    </form>
  );
}

const benefits = [
  {
    title: "Invite with one click",
    description:
      "Share a secure invite link instantly and bring teammates into the room without friction.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
        <path d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
        <path d="M3 8l9-6 9 6" />
      </svg>
    ),
    color: "bg-secondary/30 text-secondary-foreground",
  },
  {
    title: "Stay in sync",
    description:
      "Stay aligned as a team with real-time updates and consistent voting progress across all devices.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 11h20" />
      </svg>
    ),
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Built for focus",
    description:
      "Minimal and modern experience keeps attention on the discussion, not the tooling.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 15h.01" />
        <path d="M12 11h.01" />
      </svg>
    ),
    color: "bg-accent/30 text-foreground",
  },
];
