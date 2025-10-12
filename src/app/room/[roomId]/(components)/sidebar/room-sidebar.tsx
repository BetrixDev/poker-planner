import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { Logo } from "~/components/logo";
import { Issues } from "./issues";
import { VoteHistory } from "./vote-history";
import { Facilitators } from "./facilitators";
import { Users } from "./users";

type RoomSidebarProps = React.ComponentProps<typeof Sidebar> & {
  presenceId: string;
};

export function RoomSidebar({ presenceId, ...props }: RoomSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
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
        <VoteHistory />
        <SidebarSeparator />
        <Facilitators presenceId={presenceId} />
        <Users presenceId={presenceId} />
      </SidebarContent>
    </Sidebar>
  );
}
