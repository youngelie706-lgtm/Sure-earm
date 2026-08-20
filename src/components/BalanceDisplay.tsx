export default function BalanceDisplay({ balanceKobo } : { balanceKobo: number }) {
  return (
    <div className="p-4 bg-slate-900 rounded">
      <div className="text-sm text-neutral-400">Available balance</div>
      <div className="text-2xl font-bold">₦{(balanceKobo/100).toFixed(2)}</div>
    </div>
  )
}
