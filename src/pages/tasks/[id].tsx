import useSWR from 'swr';
import { useState } from 'react';
import Header from '../../components/Header';
import Loading from '../../components/Loading';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export default function TaskDetail({ params } : any) {
  // Next.js pages get query via router; for simplicity we'll use window.location
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;
  const { data, error } = useSWR(id ? `/api/tasks/${id}` : null, fetcher);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load</div>;

  const task = data;

  async function complete() {
    setLoading(true); setMessage(null);
    try {
      // generate idempotency key
      const key = cryptoRandomId();
      const res = await fetch('/api/tasks/complete', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ taskId: task.id, idempotencyKey: key }) });
      const body = await res.json();
      if (!res.ok) {
        setMessage(body.message || 'Failed');
      } else {
        if (body.rewarded) setMessage(`Rewarded ₦${(body.amountKobo/100).toFixed(2)}`);
        else if (body.pending) setMessage('Submission pending review');
        else setMessage('Completed');
      }
    } catch (err) {
      setMessage('Server error');
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <p className="mt-2 text-neutral-300">{task.description}</p>
        <div className="mt-4 p-4 bg-slate-800 rounded">Reward: ₦{(task.rewardKobo/100).toFixed(2)}</div>
        <div className="mt-4">
          <button disabled={loading} onClick={complete} className="px-4 py-2 bg-electric text-navy rounded">{loading ? 'Processing...' : 'Complete task'}</button>
          {message && <div className="mt-3">{message}</div>}
        </div>
      </main>
    </div>
  )
}

function cryptoRandomId() {
  // lightweight id generator for client-side idempotency key
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
