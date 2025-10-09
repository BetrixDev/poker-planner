import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { nanoid } from "nanoid";
import http from "../convex/http";

// This middleware is used to give un-authed users a unique id to use for presence in rooms
export function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  const response = NextResponse.next();

  if (sessionCookie) {
    return response;
  }

  const uniqueId = nanoid(10);

  response.cookies.set("roomPresenceId", uniqueId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export const config = {
  matcher: ["/room/:path*"],
};
