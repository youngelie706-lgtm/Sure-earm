import useSWR from 'swr';
import Header from '../../components/Header';
import Loading from '../../components/Loading';

const fetcher = (url:string) => fetch(url).then(r=>r.json());

export default function Admin() {
  const { data, error } = useSWR('/api/admin/users', fetcher);
  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load admin data</div>;

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <section className="mt-4">
          <h2 className="font-semibold">Users</h2>
          <table className="w-full mt-3 text-left text-neutral-300">
            <thead>
              <tr><th>Email</th><th>Name</th><th>Balance</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {data.users.map((u:any) => (
                <tr key={u.id} className="border-t border-slate-800"><td>{u.email}</td><td>{u.name}</td><td>₦{(u.balanceKobo/100).toFixed(2)}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
