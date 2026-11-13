import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Building2, Mail, MapPin, Phone, BriefcaseBusiness } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/workspace-shell";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: membership } = await supabase.from("firm_memberships").select("firm_id").eq("user_id", user.id).eq("status", "active").maybeSingle();
  if (!membership) redirect("/setup");

  const [{ data: client, error }, { data: matters }, { data: contacts }] = await Promise.all([
    supabase.from("clients").select("*").eq("firm_id", membership.firm_id).eq("id", id).maybeSingle(),
    supabase.from("matters").select("*").eq("firm_id", membership.firm_id).eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("client_contacts").select("*").eq("firm_id", membership.firm_id).eq("client_id", id).order("is_primary", { ascending: false })
  ]);
  if (error) throw new Error("Unable to load client record.");
  if (!client) notFound();

  return <WorkspaceShell>
    <div className="mx-auto max-w-5xl">
      <Link href="/clients" className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#718092] hover:text-[#203d5c]"><ArrowLeft size={14}/> Back to clients</Link>
      <div className="mb-6 rounded-xl border border-[#e8ebef] bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3f7] text-[#526e88]"><Building2 size={21}/></div><div><div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a3]">{client.client_ref} · {client.client_type}</div><h1 className="text-2xl font-semibold tracking-tight text-[#172333]">{client.display_name}</h1>{client.legal_name && <p className="mt-1 text-xs text-[#7a8695]">{client.legal_name}</p>}</div></div>
          <span className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-medium ${client.status==="active"?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{client.status}</span>
        </div>
        <div className="mt-7 grid gap-4 border-t border-[#edf0f3] pt-5 sm:grid-cols-3">
          <div className="flex items-start gap-2 text-xs text-[#596779]"><Mail size={15} className="mt-0.5 text-[#93a0ad]"/>{client.email || "No email recorded"}</div>
          <div className="flex items-start gap-2 text-xs text-[#596779]"><Phone size={15} className="mt-0.5 text-[#93a0ad]"/>{client.phone || "No phone recorded"}</div>
          <div className="flex items-start gap-2 text-xs text-[#596779]"><MapPin size={15} className="mt-0.5 text-[#93a0ad]"/>{[client.city,client.state_region,client.country_code].filter(Boolean).join(", ") || "No location recorded"}</div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-[#e8ebef] bg-white p-5">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Linked matters</h2><p className="mt-1 text-[11px] text-[#8a95a3]">{matters?.length ?? 0} matters</p></div><Link href="/matters" className="text-[11px] font-semibold text-[#315d86]">Matter register</Link></div>
          {matters?.length ? <div className="divide-y divide-[#edf0f3]">{matters.map(m=><Link key={m.id} href={`/matters/${m.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 hover:bg-[#fcfcfd]"><div><div className="text-xs font-semibold text-[#34465a]">{m.title}</div><div className="mt-1 text-[10px] text-[#8a95a3]">{m.matter_ref} · {m.practice_area || "Practice area not set"}</div></div><span className="text-[10px] text-[#718092]">{m.status.replace("_"," ")}</span></Link>)}</div> : <div className="py-9 text-center"><BriefcaseBusiness size={20} className="mx-auto mb-2 text-[#a0aab5]"/><p className="text-xs text-[#8a95a3]">No matters linked to this client yet.</p></div>}
        </section>
        <div className="space-y-5">
          <section className="rounded-xl border border-[#e8ebef] bg-white p-5"><h2 className="text-sm font-semibold text-[#26384b]">Conflict check</h2><div className="mt-3 flex items-center justify-between"><span className="text-xs text-[#7a8695]">Current status</span><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${client.conflict_check_status==="clear"?"bg-emerald-50 text-emerald-700":client.conflict_check_status==="flagged"?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`}>{client.conflict_check_status.replace("_"," ")}</span></div><p className="mt-3 text-[11px] leading-5 text-[#8994a1]">A pending conflict check should be completed and documented before accepting an engagement.</p>{client.conflict_checked_at && <p className="mt-2 text-[10px] text-[#9aa3af]">Checked {new Date(client.conflict_checked_at).toLocaleDateString("en-NG")}</p>}</section>
          <section className="rounded-xl border border-[#e8ebef] bg-white p-5"><h2 className="text-sm font-semibold text-[#26384b]">Other details</h2><dl className="mt-3 space-y-3 text-xs"><div><dt className="text-[#9aa3af]">Industry</dt><dd className="mt-1 text-[#536174]">{client.industry || "—"}</dd></div><div><dt className="text-[#9aa3af]">Address</dt><dd className="mt-1 text-[#536174]">{client.address || "—"}</dd></div><div><dt className="text-[#9aa3af]">Internal notes</dt><dd className="mt-1 whitespace-pre-wrap leading-5 text-[#536174]">{client.notes || "No notes recorded."}</dd></div></dl></section>
          <section className="rounded-xl border border-[#e8ebef] bg-white p-5"><h2 className="text-sm font-semibold text-[#26384b]">Additional contacts</h2>{contacts?.length ? <div className="mt-3 space-y-3">{contacts.map(contact=><div key={contact.id} className="border-t border-[#edf0f3] pt-3 first:border-0 first:pt-0"><div className="text-xs font-semibold text-[#455365]">{contact.full_name}{contact.is_primary?" · Primary":""}</div><div className="mt-1 text-[10px] text-[#8994a1]">{contact.role_title || "Contact"} · {contact.email || contact.phone || "No contact details"}</div></div>)}</div> : <p className="mt-2 text-[11px] text-[#8994a1]">No additional contacts recorded.</p>}</section>
        </div>
      </div>
    </div>
  </WorkspaceShell>;
}
