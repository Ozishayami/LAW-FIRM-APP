import Link from "next/link";
import { CalendarDays, ChevronRight, FilePlus2, Plus, ReceiptText, Users, BriefcaseBusiness, CircleAlert, CheckSquare, Mail, ArrowUpRight } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace-shell";

const stats = [
  { label: "Active matters", value: "—", note: "Live matters across the firm", icon: BriefcaseBusiness, href: "/matters" },
  { label: "Active clients", value: "—", note: "Client relationships", icon: Users, href: "/clients" },
  { label: "Outstanding invoices", value: "—", note: "Awaiting payment", icon: ReceiptText, href: "/finance" },
  { label: "Tasks due this week", value: "—", note: "Across your team", icon: CalendarDays, href: "/tasks" },
];
const attention = [
  { title: "No deadlines have been added", detail: "Add court dates, filing deadlines and key milestones to keep them visible.", action: "Open calendar", href: "/calendar" },
  { title: "Set up your first matter", detail: "Create a matter to organise its people, documents, tasks and billing in one place.", action: "View matters", href: "/matters" },
  { title: "Connect your communications", detail: "Gmail integration will be configured after the workspace foundation is in place.", action: "View communications", href: "/communications" },
];
const today = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function Home() {
  return <WorkspaceShell>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[#8a95a3]">{today}</div><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-[#172333]">Your firm at a glance.</h1><p className="mt-1.5 text-sm text-[#7a8695]">A clear view of the work, people and deadlines that keep the firm moving.</p></div>
      <div className="flex flex-wrap gap-2"><Link href="/tasks" className="inline-flex items-center gap-2 rounded-lg border border-[#dfe4e9] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#425267] shadow-sm hover:bg-[#f9fafb]"><Plus size={15}/> New task</Link><Link href="/matters" className="inline-flex items-center gap-2 rounded-lg bg-[#203d5c] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#294d70]"><FilePlus2 size={15}/> Create matter</Link></div>
    </div>

    <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({label,value,note,icon:Icon,href}) => <Link href={href} key={label} className="group rounded-xl border border-[#e8ebef] bg-white p-4.5 shadow-[0_1px_2px_rgba(20,35,50,0.02)] transition hover:border-[#cfd8e1] hover:shadow-sm"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium text-[#7c8897]">{label}</span><Icon size={16} className="text-[#8794a3]"/></div><div className="flex items-end justify-between"><div className="text-[27px] font-semibold tracking-tight text-[#23364a]">{value}</div><ArrowUpRight size={15} className="mb-1 text-[#a3adb8] opacity-0 transition group-hover:opacity-100"/></div><div className="mt-1 text-[11px] text-[#9aa3af]">{note}</div></Link>)}
    </div>

    <section className="mb-7 rounded-xl border border-[#dfe6ec] bg-[#f0f4f7] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#496783]"><CheckSquare size={17}/></div><div><div className="text-sm font-semibold text-[#2b4157]">Get your workspace ready</div><p className="mt-1 max-w-2xl text-xs leading-5 text-[#748496]">Start by adding your clients and matters. Tasks, documents, billing and reminders will connect to those records as each module is built.</p></div></div>
      <Link href="/clients" className="mt-4 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#315d86] sm:mt-0">Explore client records <ChevronRight size={14}/></Link>
    </section>

    <div className="mb-7 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Needs attention</h2><p className="mt-1 text-xs text-[#8a95a3]">Items that need your review or action</p></div><span className="rounded-full bg-[#f5f6f8] px-2.5 py-1 text-[10px] font-medium text-[#788493]">Setup stage</span></div>
        <div className="divide-y divide-[#edf0f3]">{attention.map(item=><div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0"><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8] text-[#718092]"><CircleAlert size={16}/></div><div className="min-w-0 flex-1"><div className="text-xs font-semibold text-[#34465a]">{item.title}</div><p className="mt-1 max-w-xl text-[11px] leading-5 text-[#8994a1]">{item.detail}</p><Link href={item.href} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#315d86]">{item.action}<ChevronRight size={13}/></Link></div></div>)}</div>
      </section>
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Today’s schedule</h2><p className="mt-1 text-xs text-[#8a95a3]">Meetings, hearings and deadlines</p></div><Link href="/calendar" className="text-[11px] font-semibold text-[#315d86]">View calendar</Link></div>
        <div className="flex flex-col items-center py-7 text-center"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6f8] text-[#7d8b9a]"><CalendarDays size={18}/></div><div className="text-xs font-semibold text-[#536174]">Nothing scheduled yet</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-[#98a1ad]">Court dates, client meetings and reminders will appear here once added.</p></div>
        <Link href="/calendar" className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#dfe4e9] py-2.5 text-xs font-medium text-[#6c7a8a] hover:bg-[#fafbfc]"><Plus size={14}/> Open calendar</Link>
      </section>
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Client updates</h2><p className="mt-1 text-xs text-[#8a95a3]">Keep clients informed on active work</p></div><Link href="/communications" className="text-[11px] font-semibold text-[#315d86]">Open inbox</Link></div><div className="flex flex-col items-center py-7 text-center"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6f8] text-[#7d8b9a]"><Mail size={18}/></div><div className="text-xs font-semibold text-[#536174]">No client updates due</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-[#98a1ad]">Client update reminders will appear here after matters and communications are connected.</p></div></section>
      <section className="rounded-xl border border-[#e8ebef] bg-white p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#26384b]">Recent financial activity</h2><p className="mt-1 text-xs text-[#8a95a3]">Invoices, receipts and expenses</p></div><Link href="/finance" className="text-[11px] font-semibold text-[#315d86]">View finance</Link></div><div className="flex flex-col items-center py-7 text-center"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f6f8] text-[#7d8b9a]"><ReceiptText size={18}/></div><div className="text-xs font-semibold text-[#536174]">No financial activity yet</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-[#98a1ad]">Invoices, payments and expenses will be listed here once financial records are enabled.</p></div></section>
    </div>
    <p className="mt-7 text-center text-[10px] text-[#a1aab5]">Preview workspace · No client or financial records have been entered.</p>
  </WorkspaceShell>;
}
