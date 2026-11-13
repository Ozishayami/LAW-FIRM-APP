import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function NotFound() {
  return <WorkspaceShell><div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center text-center"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#91a0af]">404 · Page not found</div><h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#23364a]">This page isn’t here.</h1><p className="mt-2 text-sm leading-6 text-[#8290a0]">The page may have moved, or the address may be incorrect.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white"><ArrowLeft size={14}/> Back to overview</Link></div></WorkspaceShell>;
}
