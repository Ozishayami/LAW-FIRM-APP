import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e8ebef] bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172c46] text-sm font-semibold text-white">C</div>
          <div><div className="text-base font-semibold text-[#172333]">Counsel</div><div className="text-[10px] uppercase tracking-[0.16em] text-[#8993a0]">Firm workspace</div></div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a95a3]">Secure workspace access</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172333]">Sign in to your firm</h1>
        <p className="mt-2 text-sm leading-6 text-[#7d8997]">Enter your work email. We’ll send you a secure sign-in link.</p>
        <div className="mt-7"><LoginForm /></div>
        <p className="mt-7 text-center text-[11px] leading-5 text-[#9aa3af]">Access is limited to invited firm members. If you need an account, contact your workspace administrator.</p>
      </div>
    </main>
  );
}
