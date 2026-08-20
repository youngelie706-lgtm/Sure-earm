import Header from '../../components/Header';
import useSWR from 'swr';
import Loading from '../../components/Loading';

const fetcher = (url:string) => fetch(url).then(r=>r.json());

export default function Wallet() {
  const { data, error } = useSWR('/api/user/me', fetcher);
  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load</div>;

  const { user } = data;

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <div className="mt-4 p-4 bg-slate-900 rounded">
          <div className="text-sm text-neutral-400">Current balance</div>
          <div className="text-2xl font-bold">₦{(user.balanceKobo/100).toFixed(2)}</div>
        </div>

        <section className="mt-4">
          <h2 className="font-semibold">Request withdrawal (Demo)</h2>
          <WithdrawalForm balanceKobo={user.balanceKobo} />
        </section>
      </main>
    </div>
  )
}

function WithdrawalForm({ balanceKobo }: { balanceKobo: number }) {
  const [amount, setAmount] = useSWR as any; // placeholder to avoid TS error in scaffold
  return (
    <div className="mt-2 p-4 bg-slate-800 rounded">Demo withdrawal UI — will hook up in next iteration.</div>
  )
}
