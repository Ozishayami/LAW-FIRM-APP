import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, UserRound, Scale } from "lucide-react";
import { MatterCollaboration } from "@/components/matter-collaboration";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace-shell";

export default async function MatterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: membership } = await supabase.from("firm_memberships").select("firm_id").eq("user_id", user.id).eq("status", "active").maybeSingle();
  if (!membership) redirect("/setup");

  const [{ data: matter, error }, { data: parties }, { data: tasks }] = await Promise.all([
    supabase.from("matters").select("*").eq("firm_id", membership.firm_id).eq("id", id).maybeSingle(),
    supabase.from("matter_parties").select("*").eq("firm_id", membership.firm_id).eq("matter_id", id).order("created_at"),
    supabase.from("tasks").select("*").eq("firm_id", membership.firm_id).eq("matter_id", id).order("due_at", { ascending: true })
  ]);
  if (error) throw new Error("Unable to load matter record.");
  if (!matter) notFound();
  const { data: teamRows } = await supabase.from("matter_team_members").select("id,user_id,assignment_role").eq("firm_id", membership.firm_id).eq("matter_id", id).order("created_at");
  const { data: activeMemberships } = await supabase.from("firm_memberships").select("user_id").eq("firm_id", membership.firm_id).eq("status", "active");
  const memberIds = (activeMemberships ?? []).map(item => item.user_id);
  const [{ data: profiles }, { data: externalDocs }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,job_title").in("id", memberIds.length ? memberIds : ["00000000-0000-0000-0000-000000000000"]),
    supabase.from("matter_external_documents").select("*").eq("firm_id", membership.firm_id).eq("matter_id", id).order("created_at", { ascending: false })
  ]);
  const { data: client } = await supabase.from("clients").select("id,display_name,client_ref").eq("firm_id", membership.firm_id).eq("id", matter.client_id).maybeSingle();

  return <WorkspaceShell>
    <div className="mx-auto max-w-5xl">
      <Link href="/matters" className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#718092] hover:text-[#203d5c]"><ArrowLeft size={14}/> Back to matters</Link>
      <div className="mb-6 rounded-xl border border-[#e8ebef] bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div className="flex gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3f7] text-[#526e88]"><BriefcaseBusiness size={21}/></div><div><div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a3]">{matter.matter_ref} · {matter.practice_area || "Legal matter"}</div><h1 className="text-2xl font-semibold tracking-tight text-[#172333]">{matter.title}</h1><p className="mt-1 text-xs text-[#7a8695]">{client ? <Link href={`/clients/${client.id}`} className="font-medium text-[#315d86] hover:underline">{client.display_name} · {client.client_ref}</Link> : "Client record unavailable"}</p></div></div><span className="w-fit rounded-full bg-[#eef3f7] px-3 py-1.5 text-[11px] font-medium capitalize text-[#496783]">{matter.status.replace("_"," ")}</span></div>
        <div className="mt-7 grid gap-4 border-t border-[#edf0f3] pt-5 sm:grid-cols-4"><div><div className="text-[10px] text-[#9aa3af]">Priority</div><div className="mt-1 text-xs font-medium capitalize text-[#536174]">{matter.priority}</div></div><div><div className="text-[10px] text-[#9aa3af]">Billing</div><div className="mt-1 text-xs font-medium text-[#536174]">{matter.billing_type.replace("_"," ")}</div></div><div><div className="text-[10px] text-[#9aa3af]">Opened</div><div className="mt-1 text-xs font-medium text-[#536174]">{new Date(matter.opened_on+"T00:00:00").toLocaleDateString("en-NG")}</div></div><div><div className="text-[10px] text-[#9aa3af]">Confidentiality</div><div className="mt-1 text-xs font-medium capitalize text-[#536174]">{matter.confidentiality.replace("_"," ")}</div></div></div>
      </div>
      <MatterCollaboration firmId={membership.firm_id} matterId={id} team={teamRows ?? []} members={(profiles ?? []).map(profile => ({ id: profile.id, name: profile.full_name || profile.email || "Firm member", email: profile.email, title: profile.job_title }))} documents={externalDocs ?? []} />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-[#e8ebef] bg-white p-5"><div className="mb-4 flex items-center gap-2"><Scale size={16} className="text-[#8292a2]"/><h2 className="text-sm font-semibold text-[#26384b]">Matter details</h2></div><dl className="grid gap-4 sm:grid-cols-2">{[["Matter type",matter.matter_type],["Court / tribunal",matter.court_or_tribunal],["Court reference",matter.court_reference],["Limitation date",matter.limitation_date],["Agreed fee",matter.agreed_fee===null?null:new Intl.NumberFormat("en-NG",{style:"currency",currency:matter.currency||"NGN",maximumFractionDigits:2}).format(matter.agreed_fee)],["Description",matter.description]].map(([label,value])=><div key={label}><dt className="text-[10px] text-[#9aa3af]">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#536174]">{value || "—"}</dd></div>)}</dl></section>
        <section className="rounded-xl border border-[#e8ebef] bg-white p-5"><div className="mb-4 flex items-center gap-2"><UserRound size={16} className="text-[#8292a2]"/><h2 className="text-sm font-semibold text-[#26384b]">Other parties</h2></div>{parties?.length ? <div className="space-y-3">{parties.map(p=><div key={p.id} className="border-t border-[#edf0f3] pt-3 first:border-0 first:pt-0"><div className="text-xs font-semibold text-[#455365]">{p.party_name}</div><div className="mt-1 text-[10px] text-[#8994a1]">{p.party_type} · {p.represented_by || "Representation not recorded"}</div></div>)}</div> : <p className="text-xs text-[#8994a1]">No additional parties recorded.</p>}</section>
        <section className="rounded-xl border border-[#e8ebef] bg-white p-5 lg:col-span-2"><div className="mb-4 flex items-center gap-2"><CalendarDays size={16} className="text-[#8292a2]"/><h2 className="text-sm font-semibold text-[#26384b]">Matter tasks</h2></div>{tasks?.length ? <div className="divide-y divide-[#edf0f3]">{tasks.map(task=><div key={task.id} className="flex items-center justify-between gap-3 py-3 first:pt-0"><div><div className="text-xs font-medium text-[#455365]">{task.title}</div><div className="mt-1 text-[10px] text-[#8994a1]">{task.due_at?new Date(task.due_at).toLocaleString("en-NG"):"No due date"} · {task.priority}</div></div><span className="text-[10px] capitalize text-[#718092]">{task.status.replace("_"," ")}</span></div>)}</div> : <p className="text-xs text-[#8994a1]">No tasks have been linked to this matter.</p>}</section>
      </div>
      <p className="mt-5 text-[10px] leading-5 text-[#a1aab5]">This view shows matter details within the firm&apos;s membership controls. Restricted-matter team-level access is not yet enforced; do not store highly restricted information until that control is implemented.</p>
    </div>
  </WorkspaceShell>;
}
