import useSWR from 'swr';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export default function Referrals() {
  const { data, error } = useSWR('/api/referrals', fetcher);
  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load</div>;

  const { referrals } = data;

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Referrals</h1>
        <p className="text-neutral-400">Share your referral code to earn rewards</p>
        <div className="mt-4 p-4 bg-slate-900 rounded">
          <div>Your referral link (demo): <code>{typeof window !== 'undefined' ? `${window.location.origin}/?ref=${/* placeholder */ ''}` : ''}</code></div>
        </div>

        <section className="mt-4">
          <h2 className="font-semibold">History</h2>
          {referrals.length === 0 ? (
            <EmptyState message="No referrals yet" />
          ) : (
            <ul className="mt-3 space-y-2">
              {referrals.map((r:any) => (
                <li key={r.id} className="p-3 bg-slate-800 rounded">{r.email} — joined {new Date(r.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
