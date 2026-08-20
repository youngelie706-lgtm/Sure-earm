import { useState } from 'react'
import Router from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      Router.push('/dashboard');
    } catch (err) {
      setError('Server error');
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-navy text-neutral-100 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-slate-900 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {error && <div className="bg-red-900 p-2 mb-3">{error}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 rounded bg-slate-800" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 mb-3 rounded bg-slate-800" />
        <button disabled={loading} className="w-full bg-electric text-navy p-2 rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </main>
  )
}
