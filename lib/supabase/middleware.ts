import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const pathname = request.nextUrl.pathname;
  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/auth");
  const isSetup = pathname.startsWith("/setup");

  if (!data?.claims && !isPublic) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (data?.claims) {
    const userId = data.claims.sub;
    const { data: membership, error } = await supabase.from("firm_memberships").select("id").eq("user_id", userId).eq("status", "active").limit(1).maybeSingle();
    if (error) return new NextResponse("Unable to verify workspace access. Please try again.", { status: 503 });
    if (!membership && !isSetup && !pathname.startsWith("/auth")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/setup";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    if (membership && (isSetup || pathname === "/login")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }
  return response;
}