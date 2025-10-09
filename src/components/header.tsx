"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Building2, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  UserButton,
  UserAvatar,
} from "@daveyplate/better-auth-ui";

export function Header() {
  const pathname = usePathname();

  if (pathname.includes("/room/")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <rect
                  x="4"
                  y="8"
                  width="10"
                  height="14"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="18"
                  y="8"
                  width="10"
                  height="14"
                  rx="2"
                  fill="currentColor"
                />
                <circle cx="9" cy="13" r="1.5" fill="white" />
                <circle cx="23" cy="13" r="1.5" fill="white" />
              </svg>
              <span className="text-xl md:text-2xl font-semibold tracking-tight">
                Poker Planner
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link href="/room?tab=create">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                <span>Create a Room</span>
              </Button>
            </Link>
            <SignedIn>
              <Link href="/my-rooms">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  <span>Manage Rooms</span>
                </Button>
              </Link>
            </SignedIn>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton
                size="sm"
                className="hidden md:inline-flex"
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
                href={`/auth/sign-in?redirectTo=${encodeURIComponent(
                  pathname
                )}`}
              >
                <Button variant="ghost" className="hidden md:inline-flex">
                  Log In
                </Button>
              </Link>
              <Link
                href={`/auth/sign-up?redirectTo=${encodeURIComponent(
                  pathname
                )}`}
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
