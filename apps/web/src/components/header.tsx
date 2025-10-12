import { Button } from "~/components/ui/button";
import { Building2, Menu } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import { Logo } from "./logo";
import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  if (pathname.includes("/room/")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-xl md:text-2xl font-semibold tracking-tight">
                Poker Planner
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link to="/room" search={{ tab: "create" }}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <span>Create a Room</span>
              </Button>
            </Link>
            <Link to="/my-rooms">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <span>Manage Rooms</span>
              </Button>
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton
                size="sm"
                className="hidden md:inline-flex text-foreground hover:bg-secondary/75 bg-secondary/50 border"
                additionalLinks={[
                  {
                    href: "/my-rooms",
                    icon: <Building2 className="h-4 w-4" />,
                    label: "Manage Rooms",
                    signedIn: true,
                    separator: true,
                  },
                ]}
              />
            </SignedIn>
            <SignedOut>
              <Link
                to="/auth/$authView"
                search={{ redirectTo: pathname }}
                params={{ authView: "sign-in" }}
              >
                <Button variant="ghost" className="hidden md:inline-flex">
                  Log In
                </Button>
              </Link>
              <Link
                to="/auth/$authView"
                search={{ redirectTo: pathname }}
                params={{ authView: "sign-up" }}
              >
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
