import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronRight, Clock3, FilePlus2, Plus, ReceiptText, Users, BriefcaseBusiness, CircleAlert } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";

const stats = [
  { label: "Active matters", value: "—", note: "Live matters across the firm", icon: BriefcaseBusiness },
  { label: "Active clients", value: "—", note: "Client relationships", icon: Users },
  { label: "Outstanding invoices", value: "—", note: "Awaiting payment", icon: ReceiptText },
  { label: "Tasks due this week", value: "—", note: "Across your team", icon: CalendarDays },
];
const attention = [
  { title: "No deadlines have been added", detail: "Add court dates, filing deadlines and key milestones to keep them visible.", action: "Open calendar", href: "/calendar" },
  { title: "Set up your first matter", detail: "Create a matter to organise its people, documents, tasks and billing in one place.", action: "View matters", href: "/matters" },
  { title: "Connect your communications", detail: "Gmail integration will be configured after the workspace foundation is in place.", action: "View communications", href: "/communications" },
];
const events = [
  { time: "—", title: "Your calendar is clear", meta: "Add a meeting, court appearance or filing deadline." },
  { time: "—", title: "No upcoming reminders", meta: "Reminders will appear here once events are created." },
];
export default function Home() {
  return <WorkspaceShell>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><div className="mb-2 text-xs font-medium text-[#8a95a3]">THURSDAY, 12 NOVEMBER 2026</div><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-[#172333]">Good afternoon.</h1><p className="mt-1.5 text-sm text-[#7a8695]">Here’s what’s happening across your firm today.</p></div>
      <div className="flex gap-2"><Link href="/tasks" className="inline-flex items-center gap-2 rounded-lg border border-[#dfe4e9] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#425267] shadow-sm hover:bg-[#f9fafb]"><Plus size={15}/> New task</Link><Link href="/matters" className="inline-flex items-center gap-2 rounded-lg bg-[#203d5c] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#294d70]"><FilePlus2 size={15}/> Create matter</Link></div>
    </div>
    <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({label,value,note,icon:Icon}) => <div key={label} className="rounded-xl border border-[#e8ebef] bg-white p-4.5 shadow-[0_1px_2px_rgba(20,35,50,0.02)]"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium text-[#7c8897]">{label}</span><Icon size={16} className="text-[#8794a3]"/></div><div className="text-[27px] font-semibold tracking-tight text-[#23364a]">{value}</div><div className="mt-1 text-[11px] text-[#9aa3af]">{note}</div></div>)}
    </div>
    <div className="mb-7 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Needs attention</h2><p className="mt-1 text-xs text-[#8a95a3]">Items that need your review or action</p></div><span className="rounded-full bg-[#f5f6f8] px-2.5 py-1 text-[10px] font-medium text-[#788493]">Getting started</span></div>
        <div className="divide-y divide-[#edf0f3]">{attention.map(item=><div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8] text-[#718092]"><CircleAlert size={16}/></div><div className="min-w-0 flex-1"><div className="text-xs font-semibold text-[#34465a]">{item.title}</div><p className="mt-1 max-w-xl text-[11px] leading-5 text-[#8994a1]">{item.detail}</p><Link href={item.href} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#315d86]">{item.action}<ChevronRight size={13}/></Link></div></div>)}</div>
      </section>
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Today’s schedule</h2><p className="mt-1 text-xs text-[#8a95a3]">Meetings, hearings and deadlines</p></div><Link href="/calendar" className="text-[11px] font-semibold text-[#315d86]">View calendar</Link></div>
        <div className="space-y-3">{events.map(e=><div key={e.title} className="flex gap-3 rounded-lg bg-[#f8f9fa] p-3"><div className="w-9 pt-0.5 text-[10px] font-semibold text-[#8994a1]">{e.time}</div><div><div className="text-xs font-semibold text-[#455467]">{e.title}</div><div className="mt-1 text-[11px] leading-4 text-[#929ca8]">{e.meta}</div></div></div>)}</div>
        <Link href="/calendar" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#dfe4e9] py-2.5 text-xs font-medium text-[#6c7a8a] hover:bg-[#fafbfc]"><Plus size={14}/> Add calendar event</Link>
      </section>
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Client updates</h2><p className="mt-1 text-xs text-[#8a95a3]">Keep clients informed on active work</p></div><Link href="/communications" className="text-[11px] font-semibold text-[#315d86]">Open inbox</Link></div><div className="flex flex-col items-center py-7 text-center"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6f8] text-[#7d8b9a]"><Users size={18}/></div><div className="text-xs font-semibold text-[#536174]">No client updates due</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-[#98a1ad]">Once matters and client communication are set up, update reminders will show here.</p></div></section>
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Recent financial activity</h2><p className="mt-1 text-xs text-[#8a95a3]">Invoices, receipts and expenses</p></div><Link href="/finance" className="text-[11px] font-semibold text-[#315d86]">View finance</Link></div><div className="flex flex-col items-center py-7 text-center"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6f8] text-[#7d8b9a]"><ReceiptText size={18}/></div><div className="text-xs font-semibold text-[#536174]">No financial activity yet</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-[#98a1ad]">Financial records will appear here when invoices and payments are recorded.</p></div></section>
    </div>
    <p className="mt-7 text-center text-[10px] text-[#a1aab5]">Workspace preview · No client or financial records have been entered.</p>
  </WorkspaceShell>;
}
