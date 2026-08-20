# Sure Earn (EarnHub)

Sure Earn (aka EarnHub) is a Nigerian task-and-rewards platform scaffold. This repository will contain a mobile-first fintech-style web application for users to complete tasks for Naira rewards, manage wallets, referrals, and an admin dashboard.

This initial commit contains the project README and will be used to create the repository's first commit so feature branches can be created.

Planned stack (recommended):
- Frontend: Next.js (React) + Tailwind CSS for rapid, accessible, mobile-first UI. Use server components where helpful.
- Backend: Next.js API routes (or a separate Express/NestJS app) with server-side authentication (JWT + secure cookies) and validation.
- Database: PostgreSQL (production) with Prisma ORM for type-safe database access. SQLite for local demo/testing.
- Auth: Secure password handling with bcrypt and proper salting. Never store plaintext passwords.
- Payments: Demo withdrawal flow with clear "DEMO MODE" label until a real payment provider (e.g., Paystack/Wema/Flutterwave) is integrated.

Repository scaffolding steps I will perform next:
1. Create an initial branch `scaffold/sure-earn` with a baseline frontend + backend structure.
2. Add environment example file (`.env.example`) describing required secrets.
3. Add basic Next.js app with Tailwind and example pages: homepage, auth pages, dashboard, tasks, wallet, referrals, admin area.
4. Add a backend model (Prisma schema) covering users, tasks, transactions, referrals, withdrawals, and admin records.
5. Add README sections for local development and deployment.

If you'd like a different stack (e.g., Remix, SvelteKit, Laravel, Django), tell me and I'll adapt.

Branding: I'll design an original EarnHub brand using deep navy/black, electric blue, cyan, and subtle gold accents.
