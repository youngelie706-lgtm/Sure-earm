export default function EmptyState({ message } : { message?: string }){
  return <div className="p-4 bg-slate-800 rounded text-neutral-400">{message || 'No items'}</div>
}
