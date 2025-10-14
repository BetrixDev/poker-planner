import { CrownIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export interface UserCardProps {
  userId: string;
  username: string;
  profileImage?: string;
  online: boolean;
  isOwner?: boolean;
  role?: "facilitator" | "user" | "spectator";
}

export function UserCard({
  userId,
  username,
  profileImage = "https://api.dicebear.com/9.x/glass/svg?seed=Maria",
  online,
  isOwner = false,
  role,
}: UserCardProps) {
  return (
    <div
      key={userId}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border p-3 transition-all",
        "hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
        online && "border-primary/20 bg-accent/20"
      )}
    >
      {/* Avatar with online indicator */}
      <div className="relative shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              src={profileImage ?? "/images/default-avatar.png"}
              alt={username}
              className={cn(
                "h-12 w-12 rounded-full border-2 transition-all cursor-pointer",
                online ? "border-green-500/50" : "border-border opacity-75"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>{online ? "Online" : "Offline"}</TooltipContent>
        </Tooltip>
        {online && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500 pointer-events-none" />
        )}
      </div>

      {/* User info */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-sm">{username}</span>
          {isOwner && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="gap-1 px-1.5 py-0 h-5">
                  <CrownIcon className="h-3 w-3 text-yellow-500" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Room Owner</TooltipContent>
            </Tooltip>
          )}
          {role && (
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 h-5 capitalize"
            >
              {role}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
