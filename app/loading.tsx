export default function Loading() {
  return <div className="min-h-screen bg-[#f7f8fa] p-6 sm:p-10"><div className="mx-auto max-w-[1440px] animate-pulse"><div className="mb-8 h-7 w-56 rounded bg-[#e8ebef]"/><div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(item=><div key={item} className="h-28 rounded-xl border border-[#e8ebef] bg-white"/></div><div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]"><div className="h-80 rounded-xl border border-[#e8ebef] bg-white"/><div className="h-80 rounded-xl border border-[#e8ebef] bg-white"/></div></div></div>;
}
