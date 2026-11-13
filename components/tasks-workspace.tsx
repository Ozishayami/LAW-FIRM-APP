"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, CheckSquare, Clock3, AlertCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Task = Tables<"tasks">;
type Option = { id: string; label: string };
const statuses = ["todo","in_progress","blocked","completed","cancelled"];
const priorities = ["low","normal","high","urgent"];
const pretty = (value: string) => value.replaceAll("_"," ");
const localDateTime = (value: string | null) => value ? new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Lagos"}).format(new Date(value)) : "No due date";
const toLocalInput = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("sv-SE",{timeZone:"Africa/Lagos",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(date).replace(" ","T");
};
const fromLocalInput = (value: string) => value ? new Date(value + ":00+01:00").toISOString() : null;

export function TasksWorkspace({firmId,initialTasks,clients,matters,people}:{firmId:string;initialTasks:Task[];clients:Option[];matters:Option[];people:Option[]}) {
  const [tasks,setTasks]=useState(initialTasks);
  const [query,setQuery]=useState("");
  const [status,setStatus]=useState("all");
  const [priority,setPriority]=useState("all");
  const [assignee,setAssignee]=useState("all");
  const [due,setDue]=useState("all");
  const [client,setClient]=useState("all");
  const [matter,setMatter]=useState("all");
  const [showForm,setShowForm]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [editing,setEditing]=useState<Task|null>(null);
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [taskStatus,setTaskStatus]=useState("todo");
  const [taskPriority,setTaskPriority]=useState("normal");
  const [dueAt,setDueAt]=useState("");
  const [assignedTo,setAssignedTo]=useState("");
  const [clientId,setClientId]=useState("");
  const [matterId,setMatterId]=useState("");
  const router=useRouter();
  const clientLabels=useMemo(()=>Object.fromEntries(clients.map(x=>[x.id,x.label])),[clients]);
  const matterLabels=useMemo(()=>Object.fromEntries(matters.map(x=>[x.id,x.label])),[matters]);
  const personLabels=useMemo(()=>Object.fromEntries(people.map(x=>[x.id,x.label])),[people]);
  const filtered=useMemo(()=>tasks.filter(t=>{
    const term=query.trim().toLowerCase();
    const text=[t.title,t.description,clientLabels[t.client_id??""],matterLabels[t.matter_id??""],personLabels[t.assigned_to??""]].some(v=>v?.toLowerCase().includes(term));
    const now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const dueDate=t.due_at?new Date(t.due_at):null;
    const dueMatch=due==="all"||(due==="none"&&!dueDate)||(due==="overdue"&&dueDate&&dueDate<now&&t.status!=="completed"&&t.status!=="cancelled")||(due==="today"&&dueDate&&dueDate.toDateString()===today.toDateString())||(due==="upcoming"&&dueDate&&dueDate>=today);
    return (!term||text)&&(status==="all"||t.status===status)&&(priority==="all"||t.priority===priority)&&(assignee==="all"||(assignee==="unassigned"&&!t.assigned_to)||t.assigned_to===assignee)&&(dueMatch)&&(client==="all"||t.client_id===client)&&(matter==="all"||t.matter_id===matter);
  }),[tasks,query,status,priority,assignee,due,client,matter,clientLabels,matterLabels,personLabels]);
  const overdue=tasks.filter(t=>t.due_at&&new Date(t.due_at)<new Date()&&!["completed","cancelled"].includes(t.status)).length;
  const dueSoon=tasks.filter(t=>t.due_at&&new Date(t.due_at)>=new Date()&&new Date(t.due_at).getTime()<Date.now()+48*3600000&&!["completed","cancelled"].includes(t.status)).length;
  function openEditor(task?:Task){
    const t=task??null;setEditing(t);setTitle(t?.title??"");setDescription(t?.description??"");setTaskStatus(t?.status??"todo");setTaskPriority(t?.priority??"normal");setDueAt(toLocalInput(t?.due_at??null));setAssignedTo(t?.assigned_to??"");setClientId(t?.client_id??"");setMatterId(t?.matter_id??"");setError("");setShowForm(true);
  }
  async function save(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();if(!title.trim()){setError("Enter a task title.");return;}
    if(matterId&&clientId){const linked=matters.find(m=>m.id===matterId);if(linked&&!linked.label.startsWith(clientLabels[clientId]??"")){setError("Choose the client linked to this matter, or clear the client field.");return;}}
    setSaving(true);setError("");
    try{
      const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Your session has expired. Sign in again.");
      const payload={title:title.trim(),description:description.trim()||null,status:taskStatus,priority:taskPriority,due_at:fromLocalInput(dueAt),assigned_to:assignedTo||null,client_id:clientId||null,matter_id:matterId||null,completed_at:taskStatus==="completed"?(editing?.completed_at??new Date().toISOString()):null};
      if(editing){
        const {data,error:writeError}=await supabase.from("tasks").update(payload).eq("firm_id",firmId).eq("id",editing.id).select("*").single();
        if(writeError)throw writeError;setTasks(old=>old.map(t=>t.id===editing.id?data:t));
      }else{
        const {data,error:writeError}=await supabase.from("tasks").insert({...payload,firm_id:firmId,created_by:user.id}).select("*").single();
        if(writeError)throw writeError;setTasks(old=>[data,...old]);
      }
      setShowForm(false);router.refresh();
    }catch(e){setError(e instanceof Error?e.message:"Unable to save task.");}finally{setSaving(false);}
  }
  async function changeStatus(task:Task,next:string){
    const supabase=createClient();const {error:e}=await supabase.from("tasks").update({status:next,completed_at:next==="completed"?(task.completed_at??new Date().toISOString()):null}).eq("firm_id",firmId).eq("id",task.id);
    if(e){setError(e.message);return;}setTasks(old=>old.map(t=>t.id===task.id?{...t,status:next,completed_at:next==="completed"?new Date().toISOString():null}:t));router.refresh();
  }
  return <div>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[#8a95a3]">Work management</div><h1 className="text-[27px] font-semibold tracking-[-0.04em] text-[#172333]">Tasks & checklists</h1><p className="mt-1.5 text-sm text-[#7a8695]">Keep assignments, deadlines and ownership clear across the firm.</p></div><button onClick={()=>openEditor()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white"><Plus size={15}/> Add task</button></div>
    <div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex justify-between text-xs text-[#7c8897]">Open tasks <CheckSquare size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{tasks.filter(t=>!["completed","cancelled"].includes(t.status)).length}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Not yet completed</div></div><div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex justify-between text-xs text-[#7c8897]">Overdue <AlertCircle size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#a04444]">{overdue}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Past due and still open</div></div><div className="rounded-xl border border-[#e8ebef] bg-white p-4"><div className="flex justify-between text-xs text-[#7c8897]">Due in 48 hours <Clock3 size={15}/></div><div className="mt-3 text-2xl font-semibold text-[#23364a]">{dueSoon}</div><div className="mt-1 text-[11px] text-[#9aa3af]">Upcoming deadlines</div></div></div>
    {showForm&&<form onSubmit={save} className="mb-6 rounded-xl border border-[#dfe6ec] bg-white p-5 sm:p-6"><div className="mb-5"><h2 className="text-sm font-semibold text-[#26384b]">{editing?"Update task":"Create task"}</h2><p className="mt-1 text-xs text-[#8994a1]">Dates and times are entered and displayed in Africa/Lagos time.</p></div><div className="grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Task title *</span><input required maxLength={240} value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm" placeholder="e.g. Prepare and file originating processes"/></label>
      <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[#536174]">Description</span><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm" placeholder="Instructions and relevant context"/></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Status</span><select value={taskStatus} onChange={e=>setTaskStatus(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm">{statuses.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Priority</span><select value={taskPriority} onChange={e=>setTaskPriority(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm">{priorities.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Due date & time (Lagos)</span><input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] px-3 py-2.5 text-sm"/></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Assignee</span><select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm"><option value="">Unassigned</option>{people.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Client</span><select value={clientId} onChange={e=>{setClientId(e.target.value);setMatterId("");}} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm"><option value="">No client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label><span className="mb-1.5 block text-xs font-medium text-[#536174]">Matter</span><select value={matterId} onChange={e=>{setMatterId(e.target.value);const m=matters.find(x=>x.id===e.target.value);if(m){const c=clients.find(x=>m.label.startsWith(x.label));if(c)setClientId(c.id);}}} className="w-full rounded-lg border border-[#dfe4e9] bg-white px-3 py-2.5 text-sm"><option value="">No matter</option>{matters.filter(m=>!clientId||m.label.startsWith(clientLabels[clientId]??"")).map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
    </div>{error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">{error}</p>}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setShowForm(false)} className="rounded-lg border border-[#dfe4e9] px-4 py-2.5 text-xs">Cancel</button><button disabled={saving} className="rounded-lg bg-[#203d5c] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{saving?"Saving…":"Save task"}</button></div></form>}
    <section className="overflow-hidden rounded-xl border border-[#e8ebef] bg-white"><div className="border-b border-[#edf0f3] p-4"><div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h2 className="text-sm font-semibold text-[#26384b]">Task register</h2><p className="mt-1 text-[11px] text-[#8a95a3]">{filtered.length} of {tasks.length} tasks</p></div><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3af]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks, client or matter…" className="w-full rounded-lg border border-[#e3e7eb] py-2 pl-9 pr-3 text-xs sm:w-64"/></div></div>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6"><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">All statuses</option>{statuses.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select><select value={priority} onChange={e=>setPriority(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">All priorities</option>{priorities.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select><select value={assignee} onChange={e=>setAssignee(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">All assignees</option><option value="unassigned">Unassigned</option>{people.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><select value={due} onChange={e=>setDue(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">Any due date</option><option value="overdue">Overdue</option><option value="today">Due today</option><option value="upcoming">Upcoming</option><option value="none">No due date</option></select><select value={client} onChange={e=>{setClient(e.target.value);setMatter("all");}} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">All clients</option>{clients.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select><select value={matter} onChange={e=>setMatter(e.target.value)} className="rounded-lg border border-[#e3e7eb] bg-white px-2 py-2 text-xs"><option value="all">All matters</option>{matters.filter(m=>client==="all"||m.label.startsWith(clientLabels[client]??"")).map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></div></div>
      {error&&!showForm&&<p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}
      {!filtered.length?<div className="px-5 py-14 text-center"><CheckSquare size={22} className="mx-auto mb-3 text-[#a0aab5]"/><h3 className="text-sm font-semibold text-[#536174]">{tasks.length?"No matching tasks":"No tasks have been created"}</h3><p className="mt-1 text-xs text-[#98a1ad]">{tasks.length?"Adjust your filters or search term.":"Create a task to start organising work across the firm."}</p></div>:<div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a95a3]"><tr><th className="px-5 py-3">Task</th><th className="px-4 py-3">Matter / client</th><th className="px-4 py-3">Assignee</th><th className="px-4 py-3">Due</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"/></tr></thead><tbody className="divide-y divide-[#edf0f3]">{filtered.map(t=>{const late=!!t.due_at&&new Date(t.due_at)<new Date()&&!["completed","cancelled"].includes(t.status);const soon=!!t.due_at&&!late&&new Date(t.due_at).getTime()<Date.now()+48*3600000&&!["completed","cancelled"].includes(t.status);return <tr key={t.id} className="hover:bg-[#fcfcfd]"><td className="px-5 py-4"><Link href={`/tasks/${t.id}`} className="text-xs font-semibold text-[#34465a] hover:text-[#315d86]">{t.title}</Link><div className="mt-1 max-w-[270px] truncate text-[10px] text-[#99a2ad]">{t.description||"No description"}</div></td><td className="px-4 py-4 text-xs text-[#536174]">{matterLabels[t.matter_id??""]||clientLabels[t.client_id??""]||"General task"}</td><td className="px-4 py-4 text-xs text-[#536174]">{personLabels[t.assigned_to??""]||"Unassigned"}</td><td className="px-4 py-4"><span className={`text-xs ${late?"font-semibold text-red-700":soon?"font-medium text-amber-700":"text-[#536174]"}`}>{localDateTime(t.due_at)}</span>{late&&<div className="mt-1 text-[10px] text-red-600">Overdue</div>}{soon&&<div className="mt-1 text-[10px] text-amber-600">Due soon</div>}</td><td className="px-4 py-4 text-xs capitalize text-[#536174]">{t.priority}</td><td className="px-4 py-4"><select aria-label={`Status for ${t.title}`} value={t.status} onChange={e=>changeStatus(t,e.target.value)} className="rounded-full border-0 bg-[#f4f6f8] px-2 py-1 text-[10px] capitalize text-[#596779]">{statuses.map(s=><option key={s} value={s}>{pretty(s)}</option>)}</select></td><td className="px-4 py-4"><button onClick={()=>openEditor(t)} className="text-[11px] font-semibold text-[#315d86]">Edit</button></td></tr>})}</tbody></table></div>}
    </section>
    <div className="mt-3 text-[11px] text-[#98a1ad]">Task due dates are shown in Africa/Lagos time. Notifications are not sent by this module.</div>
  </div>;
}