import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FirmSetupForm } from "@/components/firm-setup-form";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");
  const { data: membership } = await supabase.from("firm_memberships").select("id").eq("user_id", claims.claims.sub).eq("status", "active").limit(1).maybeSingle();
  if (membership) redirect("/");
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5 py-12"><div className="w-full max-w-xl rounded-2xl border border-[#e8ebef] bg-white p-8 shadow-sm sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a95a3]">Workspace setup</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172333]">Set up your firm</h1><p className="mt-2 text-sm leading-6 text-[#7d8997]">Create your firm workspace. You’ll become its first owner and can invite colleagues later.</p><div className="mt-7"><FirmSetupForm /></div></div></main>;
}
