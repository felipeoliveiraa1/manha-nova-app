import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static, images, icons and the service worker.
    "/((?!_next/static|_next/image|icons|favicon.ico|sw.js|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
