import useSWR from 'swr';
import Header from '../../components/Header';
import Loading from '../../components/Loading';

const fetcher = (url:string) => fetch(url).then(r=>r.json());

export default function AdminWithdrawals(){
  const { data, error, mutate } = useSWR('/api/admin/withdrawals', fetcher);

  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load</div>;

  async function takeAction(id:string, action:'APPROVE'|'REJECT'){
    const note = prompt('Notes (optional)') || undefined;
    const res = await fetch('/api/admin/withdrawals', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action, withdrawalId: id, notes: note }) });
    if (res.ok) mutate(); else alert('Action failed');
  }

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Withdrawal requests</h1>
        <div className="mt-4 space-y-3">
          {data.withdrawals.map((w:any) => (
            <div key={w.id} className="p-4 bg-slate-800 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{w.user.email} — ₦{(w.amountKobo/100).toFixed(2)}</div>
                <div className="text-sm text-neutral-400">{new Date(w.createdAt).toLocaleString()}</div>
                <div className="text-sm text-neutral-400">Status: {w.status}</div>
              </div>
              <div className="space-x-2">
                {w.status === 'PENDING' && (
                  <>
                    <button onClick={()=>takeAction(w.id,'APPROVE')} className="px-3 py-1 bg-electric text-navy rounded">Approve (demo)</button>
                    <button onClick={()=>takeAction(w.id,'REJECT')} className="px-3 py-1 border rounded">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
