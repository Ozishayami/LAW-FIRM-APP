import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace-shell";
import { ClientsWorkspace } from "@/components/clients-workspace";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership, error: membershipError } = await supabase
    .from("firm_memberships")
    .select("firm_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError) throw new Error("Unable to verify your firm membership.");
  if (!membership) redirect("/setup");

  const [{ data: clients, error }, { data: matterRows }] = await Promise.all([
    supabase.from("clients").select("*").eq("firm_id", membership.firm_id).order("created_at", { ascending: false }),
    supabase.from("matters").select("client_id").eq("firm_id", membership.firm_id),
  ]);

  if (error) throw new Error("Unable to load client records.");
  const matterCounts = (matterRows ?? []).reduce<Record<string, number>>((counts, matter) => {
    counts[matter.client_id] = (counts[matter.client_id] ?? 0) + 1;
    return counts;
  }, {});

  return <WorkspaceShell>
    <ClientsWorkspace firmId={membership.firm_id} initialClients={clients ?? []} matterCounts={matterCounts} />
  </WorkspaceShell>;
}
