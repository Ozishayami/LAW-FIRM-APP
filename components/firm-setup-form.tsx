"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function FirmSetupForm() {
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const supabase = createClient();
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
      const userId = claimsData?.claims?.sub;
      if (claimsError || !userId) throw new Error("Your session has expired. Please sign in again.");
      const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "firm";
      const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
      const { data: firm, error: firmError } = await supabase.from("firms").insert({
        name: name.trim(), legal_name: legalName.trim() || null, email: email.trim() || null,
        slug, owner_user_id: userId, country_code: "NG", default_currency: "NGN", timezone: "Africa/Lagos",
      }).select("id").single();
      if (firmError) throw firmError;
      const { error: membershipError } = await supabase.from("firm_memberships").insert({
        firm_id: firm.id, user_id: userId, role: "owner", status: "active", joined_at: new Date().toISOString(),
      });
      if (membershipError) throw membershipError;
      router.replace("/"); router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create workspace. Please try again.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={handleSubmit} className="space-y-4">
    <label className="block"><span className="mb-2 block text-xs font-medium text-[#455365]">Firm display name *</span><input required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Everlaw Associates" className="w-full rounded-lg border border-[#dfe4e9] px-3.5 py-3 text-sm outline-none focus:border-[#7892aa]" /></label>
    <label className="block"><span className="mb-2 block text-xs font-medium text-[#455365]">Registered legal name</span><input value={legalName} onChange={e=>setLegalName(e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-[#dfe4e9] px-3.5 py-3 text-sm outline-none focus:border-[#7892aa]" /></label>
    <label className="block"><span className="mb-2 block text-xs font-medium text-[#455365]">Firm email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="office@firm.com" className="w-full rounded-lg border border-[#dfe4e9] px-3.5 py-3 text-sm outline-none focus:border-[#7892aa]" /></label>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-3 text-xs leading-5 text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[#203d5c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#294d70] disabled:opacity-60">{busy ? "Creating workspace…" : "Create firm workspace"}</button>
  </form>;
}
