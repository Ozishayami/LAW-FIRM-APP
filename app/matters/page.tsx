import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace-shell";
import { MattersWorkspace } from "@/components/matters-workspace";

export default async function MattersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership, error: membershipError } = await supabase
    .from("firm_memberships").select("firm_id").eq("user_id", user.id).eq("status", "active").maybeSingle();
  if (membershipError) throw new Error("Unable to verify your firm membership.");
  if (!membership) redirect("/setup");

  const [{ data: matters, error }, { data: clients, error: clientsError }] = await Promise.all([
    supabase.from("matters").select("*").eq("firm_id", membership.firm_id).order("created_at", { ascending: false }),
    supabase.from("clients").select("id, display_name, client_ref").eq("firm_id", membership.firm_id).order("display_name"),
  ]);
  if (error || clientsError) throw new Error("Unable to load matter workspace data.");

  return <WorkspaceShell>
    <MattersWorkspace firmId={membership.firm_id} initialMatters={matters ?? []} clients={clients ?? []} />
  </WorkspaceShell>;
}
