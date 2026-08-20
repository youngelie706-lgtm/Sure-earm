export default function Home() {
  return (
    <main className="min-h-screen bg-navy text-neutral-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">EarnHub — Sure Earn</h1>
            <p className="text-neutral-300 mt-2">Complete simple tasks and earn Naira rewards. Fast, secure, and Nigerian-first.</p>
          </div>
        </header>

        <section className="mt-8 grid gap-6">
          <div className="bg-gradient-to-r from-navy to-[rgba(10,180,255,0.06)] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ol className="mt-4 list-decimal list-inside text-neutral-300">
              <li>Sign up and verify your account.</li>
              <li>Browse tasks and complete one you qualify for.</li>
              <li>Get rewarded in Naira (₦) — withdraw when ready (demo mode).</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800 rounded">Feature 1</div>
            <div className="p-4 bg-slate-800 rounded">Feature 2</div>
            <div className="p-4 bg-slate-800 rounded">Feature 3</div>
          </div>

          <div className="p-4 bg-slate-800 rounded">
            <h3 className="font-semibold">FAQ</h3>
            <p className="text-neutral-300">This is a scaffold. Withdrawal is demo until a payment provider is connected.</p>
          </div>

          <div className="flex gap-4">
            <a href="/auth/register" className="px-4 py-2 bg-electric text-navy rounded">Sign up</a>
            <a href="/auth/login" className="px-4 py-2 border border-electric rounded">Login</a>
          </div>
        </section>
      </div>
    </main>
  )
}
