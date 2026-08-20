import useSWR from 'swr';
import Header from '../../components/Header';
import BalanceDisplay from '../../components/BalanceDisplay';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { data, error } = useSWR('/api/user/me', fetcher);

  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load dashboard</div>;

  const { user, stats } = data;

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Welcome back, {user.name || user.email}</h1>
        <p className="text-neutral-400">Here's a snapshot of your account</p>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <BalanceDisplay balanceKobo={user.balanceKobo} />
          <div className="p-4 bg-slate-900 rounded">
            <h3 className="font-semibold">Stats</h3>
            <ul className="mt-3 text-neutral-300">
              <li>Total earned: ₦{(stats.totalEarnedKobo/100).toFixed(2)}</li>
              <li>Completed tasks: {stats.completedTasks}</li>
              <li>Referrals: {stats.referralCount}</li>
            </ul>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Recent activity</h2>
          {stats.recent.length === 0 ? (
            <EmptyState message="No recent activity" />
          ) : (
            <ul className="mt-3 space-y-2">
              {stats.recent.map((r:any) => (
                <li key={r.id} className="p-3 bg-slate-800 rounded flex justify-between">
                  <div>
                    <div className="font-medium">{r.type}</div>
                    <div className="text-sm text-neutral-400">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="font-semibold">{r.amountKobo ? `₦${(r.amountKobo/100).toFixed(2)}` : ''}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
