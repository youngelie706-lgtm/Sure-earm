import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-navy text-neutral-100 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="font-semibold text-xl flex items-center gap-2">
            <span className="w-8 h-8 bg-electric rounded-full inline-block" />
            <span>EarnHub</span>
          </a>
        </Link>
        <nav className="space-x-4 hidden md:block">
          <Link href="/tasks"><a>Tasks</a></Link>
          <Link href="/wallet"><a>Wallet</a></Link>
          <Link href="/referrals"><a>Referrals</a></Link>
          <Link href="/auth/login"><a className="ml-4 px-3 py-1 bg-electric text-navy rounded">Login</a></Link>
        </nav>
      </div>
    </header>
  )
}
