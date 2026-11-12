"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Activity, CalendarDays, CheckSquare, ChevronDown, FileText, FolderKanban,
  LayoutDashboard, Mail, Users, Wallet, BriefcaseBusiness, Bell,
} from "lucide-react";

type NavigationItem = { label: string; href: string; icon: LucideIcon };
const mainNav: NavigationItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Matters", href: "/matters", icon: FolderKanban },
  { label: "Tasks & checklists", href: "/tasks", icon: CheckSquare },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Communications", href: "/communications", icon: Mail },
];
const adminNav: NavigationItem[] = [
  { label: "Invoices & receipts", href: "/finance", icon: Wallet },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Reports", href: "/reports", icon: Activity },
  { label: "Team", href: "/team", icon: Users },
];

function NavLink({ item, active }: { item: NavigationItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined}
      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] transition ${active ? "bg-[#edf2f7] font-semibold text-[#203d5c]" : "text-[#657182] hover:bg-[#f6f8fa] hover:text-[#172333]"}`}>
      <Icon size={16} strokeWidth={1.8} />{item.label}
    </Link>
  );
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <div className="min-h-screen bg-[#f7f8fa] lg:flex">
      <aside className="hidden w-[248px] shrink-0 border-r border-[#e8ebef] bg-white px-4 py-5 lg:flex lg:flex-col">
        <Link href="/" className="mb-9 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172c46] text-white"><BriefcaseBusiness size={18}/></div>
          <div><div className="text-[15px] font-semibold tracking-tight text-[#172333]">Counsel</div><div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[#8993a0]">Firm workspace</div></div>
        </Link>
        <div className="mb-7 flex w-full items-center gap-2 rounded-lg border border-[#e8ebef] px-3 py-2.5 text-xs text-[#9aa3af]"><span className="flex-1">Workspace search</span><span className="rounded border border-[#e8ebef] px-1.5 py-0.5 text-[10px]">Soon</span></div>
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9aa3af]">Workspace</div>
        <nav className="space-y-1">{mainNav.map(item => <NavLink key={item.href} item={item} active={isActive(item.href)} />)}</nav>
        <div className="mb-2 mt-8 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9aa3af]">Administration</div>
        <nav className="space-y-1">{adminNav.map(item => <NavLink key={item.href} item={item} active={isActive(item.href)} />)}</nav>
        <div className="mt-auto border-t border-[#edf0f3] pt-4">
          <Link href="/settings" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] ${isActive("/settings") ? "bg-[#edf2f7] font-semibold text-[#203d5c]" : "text-[#657182] hover:bg-[#f6f8fa]"}`}>Settings</Link>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f7f8fa] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce5ed] text-xs font-semibold text-[#294763]">EA</div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Everlaw Associates</div><div className="text-[10px] text-[#8993a0]">Workspace admin · Preview</div></div><ChevronDown size={14} className="text-[#8993a0]"/>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-[68px] items-center justify-between border-b border-[#e8ebef] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-[#8a95a3]"><Link href="/" className="font-semibold text-[#172333] lg:hidden">Counsel</Link><span className="hidden lg:inline">Everlaw Associates</span><span className="hidden lg:inline">/</span><span className="hidden lg:inline text-[#34465a]">Workspace</span></div>
          <div className="flex items-center gap-3"><Link href="/tasks" aria-label="View tasks and reminders" className="relative rounded-lg p-2 text-[#738091] hover:bg-[#f5f7f9]"><Bell size={17}/></Link><div className="hidden h-7 w-px bg-[#e8ebef] sm:block"/><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5eaf0] text-[11px] font-semibold text-[#294763]">OJ</div><span className="hidden text-xs font-medium text-[#455365] sm:inline">Firm administrator</span></div></div>
        </header>
        <nav aria-label="Mobile navigation" className="flex gap-1 overflow-x-auto border-b border-[#e8ebef] bg-white px-4 py-2 lg:hidden">{[...mainNav, ...adminNav].map(item => <NavLink key={item.href} item={item} active={isActive(item.href)} />)}</nav>
        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">{children}</main>
      </div>
    </div>
  );
}
