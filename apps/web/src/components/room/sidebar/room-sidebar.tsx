import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { Logo } from "~/components/logo";
import { Issues } from "./issues";
import { Facilitators } from "./facilitators";
import { Users } from "./users";
import { Link } from "@tanstack/react-router";

type RoomSidebarProps = React.ComponentProps<typeof Sidebar>;

export function RoomSidebar({ ...props }: RoomSidebarProps) {
  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Logo />
                    <span className="text-xl md:text-2xl font-semibold tracking-tight">
                      Poker Planner
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <Issues />
          <SidebarSeparator />
          <Facilitators />
          <Users />
        </SidebarContent>
      </Sidebar>
    </>
  );
}
