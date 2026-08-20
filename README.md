# Sure Earn (EarnHub)

This branch contains a scaffolded Next.js + Tailwind + Prisma project for the Sure Earn (EarnHub) Nigerian task-and-rewards platform.

What's included:
- Next.js app with TypeScript and Tailwind
- Prisma schema for Users, Tasks, TaskCompletions, Transactions, Withdrawals
- API route stubs for auth, task completion
- Basic pages for homepage, register, login
- lib helpers for Prisma client and auth (bcrypt + JWT + cookies)

Important notes:
- Passwords are hashed with bcrypt; do not store plaintext passwords in production.
- Withdrawals and payments are demo-only until a payment gateway is configured.
- The database uses integer kobo values for balances to avoid floating-point issues.

Development

1. Copy .env.example to .env and set DATABASE_URL + JWT_SECRET.
2. Install dependencies: npm install
3. Generate Prisma client + migrate: npx prisma migrate dev --name init
4. Run dev server: npm run dev

Security
- Keep JWT_SECRET and database credentials out of source control.
- Enforce HTTPS in production and set secure cookies.

Next steps (planned):
- Complete UI pages: dashboard, tasks list, wallet, referrals, admin area
- Implement server-side validations, admin endpoints, and withdrawal flows
- Add tests and CI
