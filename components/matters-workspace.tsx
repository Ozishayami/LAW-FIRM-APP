"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, BriefcaseBusiness, X, ArrowUpRight, CalendarDays, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";

type Matter = Tables<"matters">;
type ClientOption = { id: string; display_name: string; client_ref: string };
const statuses = ["prospective", "open", "on_hold", "closed", "archived"];
const statusStyles: Record<string, string> = {
  prospective: "bg-blue-50 text-blue-700", open: "bg-emerald-50 text-emerald-700",
  on_hold: "bg-amber-50 text-amber-700", closed: "bg-slate-100 text-slate-600",
  archived: "bg-slate-100 text-slate-500"
};
function makeReference() { return "MAT-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0, 6).toUpperCase(); }

export function MattersWorkspace({ firmId, initialMatters, clients }: {
  firmId: string; initialMatters: Matter[]; clients: ClientOption[];
}) {
  const [matters, setMatters] = useState(initialMatters);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [practiceArea, setPracticeArea] = useState("");
  const [matterType, setMatterType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [billingType, setBillingType] = useState("fixed_fee");
  const [agreedFee, setAgreedFee] = useState("");
  const [court, setCourt] = useState("");
  const [courtReference, setCourtReference] = useState("");
  const [openedOn, setOpenedOn] = useState(new Date().toISOString().slice(0,10));
  const [confidentiality, setConfidentiality] = useState("standard");
  const router = useRouter();

  const clientNames = useMemo(() => Object.fromEntries(clients.map(client => [client.id, client.display_name])), [clients]);
  const filtered = useMemo(() => matters.filter(matter => {
    const term = query.trim().toLowerCase();
    const matches = !term || [matter.title, matter.matter_ref, matter.practice_area, matter.court_or_tribunal, clientNames[matter.client_id]]
      .some(value => value?.toLowerCase().includes(term));
    return matches && (filter === "all" || matter.status === filter);
  }), [matters, query, filter, clientNames]);

  async function createRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientId) { setError("Add a client before opening a matter."); return; }
    setSaving(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired. Sign in again.");
      const { data, error: insertError } = await supabase.from("matters").insert({
        firm_id: firmId, client_id: clientId, matter_ref: makeReference(), title: title.trim(),
        practice_area: practiceArea.trim() || null, matter_type: matterType.trim() || null,
        description: description.trim() || null, priority, billing_type: billingType,
        agreed_fee: agreedFee.trim() ? Number(agreedFee) : null, court_or_tribunal: court.trim() || null,
        court_reference: courtReference.trim() || null, opened_on: openedOn, confidentiality,
        status: "open", currency: "NGN", created_by: user.id, updated_by: user.id
      }).select("*").single();
      if (insertError) throw insertError;
      setMatters(current => [data, ...current]);
      setTitle(""); setPracticeArea(""); setMatterType(""); setDescription(""); setAgreedFee(""); setCourt(""); setCourtReference("");
      setPriority("normal"); setBillingType("fixed_fee"); setConfidentiality("standard");
      setShowForm(false); router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create matter.");
    } finally { setSaving(false); }
  }

  async function updateStatus(matter: Matter, status: string) {
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Your session has expired. Sign in again."); return; }
    const update: TablesUpdate<"matters"> = { status, updated_by: user.id };
    if (status === "closed") update.closed_on = new Date().toISOString().slice(0,10);
    if (status === "open" || status === "on_hold") update.closed_on = null;
    const { error: updateError } = await supabase.from("matters").update(update).eq("firm_id", firmId).eq("id", matter.id);
    if (updateError) { setError(updateError.message); return; }
    setMatters(current => current.map(item => item.id === matter.id ? { ...item, ...update } : item));
    router.refresh();
  }

  const openCount = matters.filter(matter => matter.status === "open").length;
  const onHoldCount = matters.filter(matter => matter.status === "on_hold").length;

  return <div>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[#8a95a3]">Legal work management</div><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-[#172333]">Matters</h1><p className="mt-1.5 text-sm text-[#7a8695]">Track each engagement, its client, responsible team and key case details.</p></div>
      <button onClick={()=>{setShowForm(v=>!v);setError("");}} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#294d70]">{showForm?<X size={15}/>:<Plus size={15}/>} {showForm?"Close form":"Open matter"}</button>
    </div>

    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">Total matters <BriefcaseBusiness size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{matters.length}</div><div className="mt-1 text-[11px] text-[#9aa3af]">All engagements</div></div>
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">Open matters <CalendarDays size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{openCount}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Currently in progress</div></div>
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">On hold <Filter size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{onHoldCount}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Paused engagements</div></div>
    </div>

    {showForm && <form onSubmit={createRecord} className="mb-6 rounded-xl border border-[#dfe6ec] bg-white p-5 sm:p-6">
      <div className="mb-5"><h2 className="text-sm font-semibold text-[#26384b]">Open a new matter</h2><p className="mt-1 text-xs text-[#8994a1]">Matter references are generated automatically. Choose the client before saving.</p></div>
      {clients.length===0 ? <div className="rounded-lg bg-amber-50 p-4 text-xs leading-5 text-amber-800">You need at least one client before opening a matter. <Link href="/clients" className="font-semibold underline">Create a client record</Link>.</div> : <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Matter title *</span><input required value={title} onChange={e=>setTitle(e.target.value)} maxLength={180} placeholder="e.g. Acquisition of commercial property in Abuja" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Client *</span><select required value={clientId} onChange={e=>setClientId(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]">{clients.map(client=><option key={client.id} value={client.id}>{client.display_name} · {client.client_ref}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Practice area</span><input value={practiceArea} onChange={e=>setPracticeArea(e.target.value)} placeholder="e.g. Corporate / Commercial" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Matter type</span><input value={matterType} onChange={e=>setMatterType(e.target.value)} placeholder="e.g. Advisory, litigation, transaction" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Priority</span><select value={priority} onChange={e=>setPriority(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm outline-none"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Billing arrangement</span><select value={billingType} onChange={e=>setBillingType(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm outline-none"><option value="fixed_fee">Fixed fee</option><option value="hourly">Hourly</option><option value="retainer">Retainer</option><option value="pro_bono">Pro bono</option><option value="other">Other</option></select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Agreed fee (NGN)</span><input type="number" min="0" step="0.01" value={agreedFee} onChange={e=>setAgreedFee(e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Date opened *</span><input type="date" required value={openedOn} onChange={e=>setOpenedOn(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Court / tribunal</span><input value={court} onChange={e=>setCourt(e.target.value)} placeholder="If applicable" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Court reference</span><input value={courtReference} onChange={e=>setCourtReference(e.target.value)} placeholder="Suit / case number" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Confidentiality</span><select value={confidentiality} onChange={e=>setConfidentiality(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm outline-none"><option value="standard">Standard</option><option value="restricted">Restricted</option><option value="highly_restricted">Highly restricted</option></select></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Matter summary</span><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Brief internal description of the engagement" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
      </div>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setShowForm(false)} className="rounded-lg border border-[#dfe4e9] px-4 py-2.5 text-xs font-medium text-[#657182]">Cancel</button><button disabled={saving||clients.length===0} className="rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{saving?"Saving…":"Save matter"}</button></div>
    </form>}

    <section className="overflow-hidden rounded-xl border border-[#e8ebef] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#edf0f3] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-sm font-semibold text-[#26384b]">Matter register</h2><p className="mt-1 text-[11px] text-[#8a95a3]">{filtered.length} of {matters.length} engagements</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3af]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search matters…" className="w-full rounded-lg border border-[#e3e7eb] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#7892aa] sm:w-56"/></div><select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-3 py-2 text-xs text-[#596779] outline-none"><option value="all">All statuses</option>{statuses.map(status=><option key={status} value={status}>{status.replace("_"," ")}</option>)}</select></div>
      </div>
      {error && !showForm && <p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-700">{error}</p>}
      {filtered.length===0 ? <div className="flex flex-col items-center px-5 py-14 text-center"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6f8] text-[#8492a1]"><BriefcaseBusiness size={19}/></div><h3 className="text-sm font-semibold text-[#536174]">{matters.length?"No matching matters":"No matters opened yet"}</h3><p className="mt-1 max-w-sm text-xs leading-5 text-[#98a1ad]">{matters.length?"Try another search or status filter.":"Open a matter against an existing client to start organising the legal work."}</p>{!matters.length && <button onClick={()=>setShowForm(true)} disabled={clients.length===0} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#203d5c] px-3.5 py-2.5 text-xs font-semibold text-white disabled:opacity-50"><Plus size={14}/> Open first matter</button>}</div>
      : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a95a3]"><tr><th className="px-5 py-3">Matter</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Practice area</th><th className="px-4 py-3">Opened</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead><tbody className="divide-y divide-[#edf0f3]">{filtered.map(matter=><tr key={matter.id} className="hover:bg-[#fcfcfd]"><td className="px-5 py-4"><Link href={`/matters/${matter.id}`} className="text-xs font-semibold text-[#34465a] hover:text-[#315d86]">{matter.title}</Link><div className="mt-1 text-[10px] text-[#99a2ad]">{matter.matter_ref}</div></td><td className="px-4 py-4 text-xs text-[#536174]">{clientNames[matter.client_id] ?? "Client record"}</td><td className="px-4 py-4 text-xs text-[#667588]">{matter.practice_area || "—"}</td><td className="px-4 py-4 text-xs text-[#667588]">{new Date(matter.opened_on+"T00:00:00").toLocaleDateString("en-NG",{day:"2-digit",month:"short",year:"numeric"})}</td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${matter.priority==="urgent"?"bg-red-50 text-red-700":matter.priority==="high"?"bg-orange-50 text-orange-700":"bg-slate-100 text-slate-600"}`}>{matter.priority}</span></td><td className="px-4 py-4"><select aria-label={`Status for ${matter.title}`} value={matter.status} onChange={e=>updateStatus(matter,e.target.value)} className={`rounded-full border-0 px-2 py-1 text-[10px] font-medium outline-none ${statusStyles[matter.status]??"bg-slate-100 text-slate-600"}`}>{statuses.map(status=><option key={status} value={status}>{status.replace("_"," ")}</option>)}</select></td><td className="px-4 py-4"><Link href={`/matters/${matter.id}`} aria-label={`Open ${matter.title}`} className="text-[#8c98a5] hover:text-[#315d86]"><ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table></div>}
    </section>
    <p className="mt-4 text-[10px] leading-5 text-[#a1aab5]">Matter confidentiality is recorded on each matter. Fine-grained restricted-matter access controls are a separate security milestone and must be completed before storing highly confidential matter materials.</p>
  </div>;
}
