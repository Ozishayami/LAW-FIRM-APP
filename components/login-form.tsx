"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: window.location.origin + "/auth/callback?next=" + encodeURIComponent(safeNext),
        },
      });
      if (error) throw error;
      setMessage("If this email belongs to an invited account, a secure sign-in link will arrive shortly.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send sign-in link. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block"><span className="mb-2 block text-xs font-medium text-[#455365]">Work email</span>
        <input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@firm.com" className="w-full rounded-lg border border-[#dfe4e9] px-3.5 py-3 text-sm text-[#26384b] outline-none transition placeholder:text-[#b0b8c1] focus:border-[#7892aa] focus:ring-2 focus:ring-[#eaf0f5]" />
      </label>
      <button disabled={busy} className="w-full rounded-lg bg-[#203d5c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#294d70] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Sending link…" : "Send secure sign-in link"}</button>
      {message && <p role="status" className="rounded-lg bg-[#f3f6f8] px-3 py-3 text-xs leading-5 text-[#526477]">{message}</p>}
    </form>
  );
}