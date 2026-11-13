"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Users, Building2, UserRound, X, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Client = Tables<"clients">;
type ClientType = "individual" | "company" | "organisation" | "government";

const typeLabels: Record<string, string> = {
  individual: "Individual", company: "Company", organisation: "Organisation", government: "Government"
};
const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700", prospect: "bg-blue-50 text-blue-700",
  inactive: "bg-slate-100 text-slate-600", archived: "bg-slate-100 text-slate-500"
};

function makeReference() {
  return "CL-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0, 6).toUpperCase();
}

export function ClientsWorkspace({ firmId, initialClients, matterCounts }: {
  firmId: string; initialClients: Client[]; matterCounts: Record<string, number>;
}) {
  const [clients, setClients] = useState(initialClients);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [clientType, setClientType] = useState<ClientType>("individual");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => clients.filter(client => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [client.display_name, client.legal_name, client.client_ref, client.email, client.phone, client.industry]
      .some(value => value?.toLowerCase().includes(term));
    return matchesQuery && (filter === "all" || client.status === filter);
  }), [clients, query, filter]);

  async function createRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired. Sign in again.");
      const { data, error: insertError } = await supabase.from("clients").insert({
        firm_id: firmId, client_ref: makeReference(), client_type: clientType,
        display_name: name.trim(), email: email.trim() || null, phone: phone.trim() || null,
        industry: industry.trim() || null, city: city.trim() || null,
        state_region: stateRegion.trim() || null, address: address.trim() || null,
        notes: notes.trim() || null, created_by: user.id, updated_by: user.id,
        conflict_check_status: "pending", status: "active"
      }).select("*").single();
      if (insertError) throw insertError;
      setClients(current => [data, ...current]);
      setName(""); setEmail(""); setPhone(""); setIndustry(""); setCity(""); setStateRegion(""); setAddress(""); setNotes("");
      setClientType("individual"); setShowForm(false); router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create client record.");
    } finally { setSaving(false); }
  }

  async function updateStatus(client: Client, status: string) {
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Your session has expired. Sign in again."); return; }
    const { error: updateError } = await supabase.from("clients").update({ status, updated_by: user.id })
      .eq("firm_id", firmId).eq("id", client.id);
    if (updateError) { setError(updateError.message); return; }
    setClients(current => current.map(item => item.id === client.id ? { ...item, status } : item));
    router.refresh();
  }

  const activeCount = clients.filter(client => client.status === "active").length;
  const pendingConflicts = clients.filter(client => client.conflict_check_status === "pending").length;

  return <div>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[#8a95a3]">Relationship management</div>
        <h1 className="text-[27px] font-semibold tracking-[-0.04em] text-[#172333]">Clients</h1>
        <p className="mt-1.5 text-sm text-[#7a8695]">A reliable record of the people and organisations your firm represents.</p>
      </div>
      <button onClick={() => { setShowForm(value => !value); setError(""); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#294d70]">
        {showForm ? <X size={15}/> : <Plus size={15}/>} {showForm ? "Close form" : "Add client"}
      </button>
    </div>

    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">Total clients <Users size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{clients.length}</div><div className="mt-1 text-[11px] text-[#9aa3af]">All client records</div></div>
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">Active clients <Building2 size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{activeCount}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Current relationships</div></div>
      <div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex items-center justify-between text-xs text-[#7c8897]">Conflict checks pending <SlidersHorizontal size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{pendingConflicts}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Require completion before engagement</div></div>
    </div>

    {showForm && <form onSubmit={createRecord} className="mb-6 rounded-xl border border-[#dfe6ec] bg-white p-5 sm:p-6">
      <div className="mb-5"><h2 className="text-sm font-semibold text-[#26384b]">New client record</h2><p className="mt-1 text-xs text-[#8994a1]">A client reference is generated automatically. Conflict status starts as pending.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Client / organisation name *</span><input required value={name} onChange={e=>setName(e.target.value)} maxLength={180} placeholder="Full name or registered organisation name" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Client type *</span><select value={clientType} onChange={e=>setClientType(e.target.value as ClientType)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"><option value="individual">Individual</option><option value="company">Company</option><option value="organisation">Organisation</option><option value="government">Government</option></select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Industry</span><input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="e.g. Financial services" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="contact@example.com" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Phone</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+234…" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">City</span><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Abuja" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium text-[#536174]">State / region</span><input value={stateRegion} onChange={e=>setStateRegion(e.target.value)} placeholder="FCT" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Address</span><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street address" className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Internal notes</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Relevant relationship notes (avoid storing privileged advice here)." className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm outline-none focus:border-[#7892aa]"/></label>
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setShowForm(false)} className="rounded-lg border border-[#dfe4e9] px-4 py-2.5 text-xs font-medium text-[#657182]">Cancel</button><button disabled={saving} className="rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save client"}</button></div>
    </form>}

    <section className="overflow-hidden rounded-xl border border-[#e8ebef] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#edf0f3] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-sm font-semibold text-[#26384b]">Client directory</h2><p className="mt-1 text-[11px] text-[#8a95a3]">{filtered.length} of {clients.length} records</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3af]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search clients…" className="w-full rounded-lg border border-[#e3e7eb] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#7892aa] sm:w-56"/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-3 py-2 text-xs text-[#596779] outline-none"><option value="all">All statuses</option><option value="active">Active</option><option value="prospect">Prospects</option><option value="inactive">Inactive</option><option value="archived">Archived</option></select>
        </div>
      </div>
      {error && !showForm && <p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-700">{error}</p>}
      {filtered.length === 0 ? <div className="flex flex-col items-center px-5 py-14 text-center"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6f8] text-[#8492a1]"><Users size={19}/></div><h3 className="text-sm font-semibold text-[#536174]">{clients.length ? "No matching clients" : "Your client directory is empty"}</h3><p className="mt-1 max-w-sm text-xs leading-5 text-[#98a1ad]">{clients.length ? "Try another search or status filter." : "Add your first client to begin linking matters, documents and billing."}</p>{!clients.length && <button onClick={()=>setShowForm(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#203d5c] px-3.5 py-2.5 text-xs font-semibold text-white"><Plus size={14}/> Add first client</button>}</div>
      : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a95a3]"><tr><th className="px-5 py-3">Client</th><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Matters</th><th className="px-4 py-3">Conflict check</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead><tbody className="divide-y divide-[#edf0f3]">{filtered.map(client=><tr key={client.id} className="hover:bg-[#fcfcfd]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef3f7] text-[#526e88]">{client.client_type === "individual" ? <UserRound size={16}/> : <Building2 size={16}/>}</div><div><Link href={`/clients/${client.id}`} className="text-xs font-semibold text-[#34465a] hover:text-[#315d86]">{client.display_name}</Link><div className="mt-1 text-[10px] text-[#99a2ad]">{typeLabels[client.client_type] ?? client.client_type}{client.industry ? " · " + client.industry : ""}</div></div></div></td><td className="px-4 py-4 text-xs font-medium text-[#667588]">{client.client_ref}</td><td className="px-4 py-4"><div className="text-xs text-[#536174]">{client.email || "—"}</div><div className="mt-1 text-[10px] text-[#99a2ad]">{client.phone || "No phone"}</div></td><td className="px-4 py-4 text-xs text-[#536174]">{matterCounts[client.id] ?? 0}</td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-medium ${client.conflict_check_status === "clear" ? "bg-emerald-50 text-emerald-700" : client.conflict_check_status === "flagged" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{client.conflict_check_status.replace("_", " ")}</span></td><td className="px-4 py-4"><select aria-label={`Status for ${client.display_name}`} value={client.status} onChange={e=>updateStatus(client,e.target.value)} className={`rounded-full border-0 px-2 py-1 text-[10px] font-medium outline-none ${statusStyles[client.status] ?? "bg-slate-100 text-slate-600"}`}><option value="active">Active</option><option value="prospect">Prospect</option><option value="inactive">Inactive</option><option value="archived">Archived</option></select></td><td className="px-4 py-4"><Link href={`/clients/${client.id}`} aria-label={`Open ${client.display_name}`} className="text-[#8c98a5] hover:text-[#315d86]"><ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table></div>}
    </section>
    <p className="mt-4 text-[10px] leading-5 text-[#a1aab5]">Client records are visible only to authorised members of this firm. Conflict checks remain pending until completed and recorded by an authorised team member.</p>
  </div>;
}
