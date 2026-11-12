"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, CalendarDays, CheckSquare, ChevronDown, ChevronLeft, CircleHelp,
  FileText, FolderKanban, LayoutDashboard, Mail, Search, Settings, Users,
  Wallet, BriefcaseBusiness, Bell, Plus, PanelLeftClose,
} from "lucide-react";

const mainNav = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Matters", href: "/matters", icon: FolderKanban },
  { label: "Tasks & checklists", href: "/tasks", icon: CheckSquare },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Communications", href: "/communications", icon: Mail },
];
const adminNav = [
  { label: "Invoices & receipts", href: "/finance", icon: Wallet },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Reports", href: "/reports", icon: Activity },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#f7f8fa] lg:flex">
      <aside className="hidden w-[248px] shrink-0 border-r border-[#e8ebef] bg-white px-4 py-5 lg:flex lg:flex-col">
        <div className="mb-9 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172c46] text-white"><BriefcaseBusiness size={18}/></div>
          <div><div className="text-[15px] font-semibold tracking-tight text-[#172333]">Counsel</div><div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#8993a0]">Firm workspace</div></div>
        </div>
        <button className="mb-7 flex w-full items-center gap-2 rounded-lg border border-[#e8ebef] px-3 py-2.5 text-left text-xs text-[#657182]"><Search size={15}/> <span className="flex-1">Search workspace</span><span className="rounded border border-[#e8ebef] px-1.5 py-0.5 text-[10px]">⌘ K</span></button>
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9aa3af]">Workspace</div>
        <nav className="space-y-1">
          {mainNav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition ${active ? "bg-[#edf2f7] font-semibold text-[#203d5c]" : "text-[#657182] hover:bg-[#f6f8fa] hover:text-[#172333]"}`}><Icon size={16} strokeWidth={1.8}/>{label}</Link>;
          })}
        </nav>
        <div className="mb-2 mt-8 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9aa3af]">Administration</div>
        <nav className="space-y-1">
          {adminNav.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition ${active ? "bg-[#edf2f7] font-semibold text-[#203d5c]" : "text-[#657182] hover:bg-[#f6f8fa] hover:text-[#172333]"}`}><Icon size={16} strokeWidth={1.8}/>{label}</Link>;
          })}
          <Link href="/team" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] ${pathname.startsWith("/team") ? "bg-[#edf2f7] font-semibold text-[#203d5c]" : "text-[#657182] hover:bg-[#f6f8fa]"}`}><Users size={16}/>Team</Link>
        </nav>
        <div className="mt-auto space-y-1 border-t border-[#edf0f3] pt-4">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#657182]" href="#"><CircleHelp size={16}/>Help & support</a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#657182]" href="#"><Settings size={16}/>Settings</a>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f7f8fa] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce5ed] text-xs font-semibold text-[#294763]">EA</div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Everlaw Associates</div><div className="text-[10px] text-[#8993a0]">Workspace admin</div></div><ChevronDown size={14} className="text-[#8993a0]"/>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-[68px] items-center justify-between border-b border-[#e8ebef] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-[#8a95a3]"><span className="lg:hidden font-semibold text-[#172333]">Counsel</span><span className="hidden lg:inline">Everlaw Associates</span><span className="hidden lg:inline">/</span><span className="hidden lg:inline text-[#34465a]">Workspace</span></div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative rounded-lg p-2 text-[#738091] hover:bg-[#f5f7f9]"><Bell size={17}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#bd7851]"/></button>
            <div className="hidden h-7 w-px bg-[#e8ebef] sm:block"/>
            <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5eaf0] text-[11px] font-semibold text-[#294763]">OJ</div><span className="hidden text-xs font-medium text-[#455365] sm:inline">Firm administrator</span><ChevronDown size={14} className="text-[#8993a0]"/></div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
