import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { api } from "@poker-planner/backend/convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";

export const Route = createFileRoute("/room")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      Create or join a room
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="create">Create a room</TabsTrigger>
          <TabsTrigger value="join">Join a room</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateRoomForm />
        </TabsContent>
        <TabsContent value="join">
          <JoinRoomForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type CreateRoomFormValues = {
  name: string;
  password?: string;
};

function CreateRoomForm() {
  const navigate = Route.useNavigate();

  const user = useConvexAuth();

  const createRoom = useMutation(api.rooms.createRoom);

  const form = useForm({
    defaultValues: {} as CreateRoomFormValues,
    onSubmit: async ({ value }) => {
      if (!user.isAuthenticated) {
        return;
      }

      const roomId = await createRoom({
        name: value.name,
        password: value.password,
      });

      navigate({
        to: "/room/$roomId",
        params: {
          roomId,
        },
      });
    },
  });

  useEffect(() => {
    if (!user.isAuthenticated) {
      authClient.signIn.anonymous();
    }
  }, [user.isAuthenticated]);

  return (
    <FieldSet>
      <FieldLegend>Create a room</FieldLegend>
      <FieldDescription>
        Create a room to begin effort estimation
      </FieldDescription>
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel>Room name</FieldLabel>
              <Input
                placeholder="My favorite team name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
              <FieldDescription>
                The name of the room to create
              </FieldDescription>
            </Field>
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                placeholder="Optional password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
              <FieldDescription>
                The password of the room to create
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </FieldGroup>
      <Button
        disabled={user.isLoading}
        type="button"
        onClick={() => form.handleSubmit()}
      >
        Create room
      </Button>
    </FieldSet>
  );
}

type JoinRoomFormValues = {
  code: string;
  password?: string;
};

function JoinRoomForm() {
  const form = useForm({ defaultValues: {} as JoinRoomFormValues });

  return <div></div>;
}
