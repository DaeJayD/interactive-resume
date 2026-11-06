import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const settings = supabaseConfig();

  if (settings) {
    const client = createServerClient(settings.url, settings.key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          for (const { name, value } of values) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of values) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });
    await client.auth.getClaims();
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: "/admin/:path*" };
