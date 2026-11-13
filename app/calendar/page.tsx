import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {WorkspaceShell} from "@/components/workspace-shell";
import {CalendarWorkspace} from "@/components/calendar-workspace";

export default async function CalendarPage(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:membership,error:membershipError}=await supabase.from("firm_memberships").select("firm_id").eq("user_id",user.id).eq("status","active").maybeSingle();
 if(membershipError)throw new Error("Unable to verify your firm membership.");if(!membership)redirect("/setup");
 const [{data:events,error},{data:tasks,error:tasksError},{data:clients,error:clientsError},{data:matters,error:mattersError},{data:members,error:membersError}]=await Promise.all([
  supabase.from("calendar_events").select("*").eq("firm_id",membership.firm_id).order("starts_at"),
  supabase.from("tasks").select("*").eq("firm_id",membership.firm_id).not("due_at","is",null),
  supabase.from("clients").select("id,display_name").eq("firm_id",membership.firm_id).order("display_name"),
  supabase.from("matters").select("id,title,matter_ref,client_id").eq("firm_id",membership.firm_id).order("title"),
  supabase.from("firm_memberships").select("user_id").eq("firm_id",membership.firm_id).eq("status","active")
 ]);
 if(error||tasksError||clientsError||mattersError||membersError)throw new Error("Unable to load calendar workspace data.");
 const clientOptions=(clients??[]).map(c=>({id:c.id,label:c.display_name}));const clientNames=Object.fromEntries(clientOptions.map(c=>[c.id,c.label]));
 const matterOptions=(matters??[]).map(m=>({id:m.id,label:`${clientNames[m.client_id]??"Client"} · ${m.matter_ref} · ${m.title}`}));
 const memberIds=(members??[]).map(m=>m.user_id);
  const {data:profiles,error:profilesError}=memberIds.length?await supabase.from("profiles").select("id,full_name,email").in("id",memberIds):{data:[],error:null};
  if(profilesError)throw new Error("Unable to load firm member profiles.");
  const people=(members??[]).map(m=>{const p=(profiles??[]).find(profile=>profile.id===m.user_id);return {id:m.user_id,label:p?.full_name||p?.email||"Firm member"};});
 return <WorkspaceShell><CalendarWorkspace firmId={membership.firm_id} initialEvents={events??[]} initialTasks={tasks??[]} clients={clientOptions} matters={matterOptions} people={people}/></WorkspaceShell>;
}