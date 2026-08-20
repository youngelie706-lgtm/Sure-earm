import useSWR from 'swr';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import TaskCard from '../../components/TaskCard';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

export default function TasksPage() {
  const { data, error } = useSWR('/api/tasks', fetcher);
  if (!data && !error) return <Loading />;
  if (error) return <div className="p-6">Failed to load</div>;

  return (
    <div className="min-h-screen bg-navy text-neutral-100">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Available tasks</h1>
        <div className="mt-4 grid gap-4">
          {data.length === 0 ? (
            <div className="p-4 bg-slate-800 rounded">No tasks available</div>
          ) : (
            data.map((t:any) => <TaskCard key={t.id} task={t} />)
          )}
        </div>
      </main>
    </div>
  )
}
