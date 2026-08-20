import Link from 'next/link'

export default function TaskCard({ task } : { task: any }) {
  return (
    <div className="p-4 bg-slate-800 rounded flex justify-between items-start">
      <div>
        <div className="font-semibold">{task.title}</div>
        <div className="text-sm text-neutral-400">{task.description}</div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{task.reward}</div>
        <Link href={`#/`}><a className="block mt-2 text-sm text-cyan-400">Complete</a></Link>
      </div>
    </div>
  )
}
