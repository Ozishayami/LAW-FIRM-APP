import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace-shell";
import { TasksWorkspace } from "@/components/tasks-workspace";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: membership, error: membershipError } = await supabase.from("firm_memberships")
    .select("firm_id").eq("user_id",user.id).eq("status","active").maybeSingle();
  if (membershipError) throw new Error("Unable to verify your firm membership.");
  if (!membership) redirect("/setup");
  const [{data:tasks,error},{data:clients,error:clientsError},{data:matters,error:mattersError},{data:members,error:membersError}] = await Promise.all([
    supabase.from("tasks").select("*").eq("firm_id",membership.firm_id).order("due_at",{ascending:true,nullsFirst:false}),
    supabase.from("clients").select("id,display_name").eq("firm_id",membership.firm_id).order("display_name"),
    supabase.from("matters").select("id,title,matter_ref,client_id").eq("firm_id",membership.firm_id).order("title"),
    supabase.from("firm_memberships").select("user_id,profiles(full_name,email)").eq("firm_id",membership.firm_id).eq("status","active")
  ]);
  if(error||clientsError||mattersError||membersError) throw new Error("Unable to load task workspace data.");
  const clientOptions=(clients??[]).map(c=>({id:c.id,label:c.display_name}));
  const clientNames=Object.fromEntries(clientOptions.map(c=>[c.id,c.label]));
  const matterOptions=(matters??[]).map(m=>({id:m.id,label:\`\${clientNames[m.client_id]??"Client"} · \${m.matter_ref} · \${m.title}\`}));
  const people=(members??[]).map(m=>{const p=Array.isArray(m.profiles)?m.profiles[0]:m.profiles;return {id:m.user_id,label:p?.full_name||p?.email||"Firm member"};});
  return <WorkspaceShell><TasksWorkspace firmId={membership.firm_id} initialTasks={tasks??[]} clients={clientOptions} matters={matterOptions} people={people}/></WorkspaceShell>;
}