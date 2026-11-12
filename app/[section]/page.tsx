import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { notFound } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";

const sections: Record<string, { title: string; description: string; items: string[] }> = {
  clients: { title: "Clients", description: "A central record of client relationships, contacts and engagement history.", items: ["Individual and corporate client profiles", "Contact details and relationship lawyer", "Linked matters, documents and billing", "Client activity and communication history"] },
  matters: { title: "Matters", description: "Organise every engagement from opening through completion.", items: ["Matter references and practice areas", "Responsible and supporting lawyers", "Matter status, milestones and key dates", "Linked tasks, documents and invoices"] },
  tasks: { title: "Tasks & checklists", description: "Turn your firm's working processes into clear, accountable actions.", items: ["Manually created tasks and checklists", "Assign owners and due dates", "Reusable checklist templates", "Automated overdue reminders"] },
  calendar: { title: "Calendar", description: "Keep hearings, meetings, filing dates and internal deadlines in view.", items: ["Court dates and filing deadlines", "Client meetings and internal events", "Assigned lawyers and reminders", "Recurring events and escalation rules"] },
  communications: { title: "Communications", description: "Bring client email conversations into the context of the work.", items: ["Gmail / Google Workspace connection", "Associate messages with clients and matters", "Email templates and attachments", "Client update tracking"] },
  finance: { title: "Invoices & receipts", description: "A reliable record of fees, time, payments and disbursements.", items: ["Fixed-fee and hourly billing", "Invoices, part-payments and receipts", "Expenses and disbursements", "Client statements and financial reports"] },
  documents: { title: "Documents", description: "Keep matter documents organised, searchable and access-controlled.", items: ["Private document storage", "Client and matter categorisation", "Version history and access permissions", "Document activity records"] },
  reports: { title: "Reports", description: "Understand workload and financial performance across the firm.", items: ["Revenue and outstanding receivables", "Billable time and expenses", "Matter and client activity", "Team workload and task completion"] },
  team: { title: "Team", description: "Set up the people and permissions behind your firm's operations.", items: ["Partners, associates and support staff", "Role-based permissions", "Matter assignment and workload", "Auditable activity history"] },
};
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const data = sections[section];
  if (!data) notFound();
  return <WorkspaceShell><div className="mx-auto max-w-3xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[#718092] hover:text-[#203d5c]"><ArrowLeft size={14}/> Back to overview</Link><div className="rounded-2xl border border-[#e8ebef] bg-white p-7 sm:p-10"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef3f7] text-[#315d86]"><Construction size={20}/></div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa3af]">Module planned</div><h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172333]">{data.title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#7d8997]">{data.description}</p><div className="my-7 border-t border-[#edf0f3]"/><h2 className="mb-4 text-xs font-semibold text-[#445469]">Planned capabilities</h2><ul className="space-y-3">{data.items.map(item=><li key={item} className="flex items-start gap-3 text-sm text-[#687688]"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#7b93aa]"/>{item}</li>)}</ul><div className="mt-8 rounded-lg bg-[#f7f8fa] p-4 text-xs leading-5 text-[#8793a1]">This module is currently a placeholder. It will be implemented in stages, with authentication, database permissions and audit history in place before real firm records are used.</div></div></div></WorkspaceShell>;
}
