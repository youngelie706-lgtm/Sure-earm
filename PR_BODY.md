# PR: feat(scaffold): Add Next.js + Prisma scaffold, dashboard, tasks, wallet, referrals, and admin UI (draft)

## Summary

- Adds a complete scaffold for Sure Earn (EarnHub) — mobile-first Next.js + TypeScript + Tailwind frontend plus Prisma schema and API stubs for auth, tasks, wallet, referrals and admin.
- Implements basic UI pages: homepage, register, login, dashboard, tasks list & detail, wallet (demo), referrals, admin users & withdrawals pages.
- Implements server-side logic for auth (bcrypt + JWT in HTTP-only cookie), idempotent task completion (DB unique constraints + idempotency key support), atomic reward transaction updates, demo withdrawal flow, and admin endpoints.

## Branch
- scaffold/sure-earn
- Branch URL: https://github.com/youngelie706-lgtm/Sure-earm/tree/scaffold%2Fsure-earn

## Key commits
- Initial README commit: https://github.com/youngelie706-lgtm/Sure-earm/commit/29c53a76196ebae8b4a19bcb0c7641ff0d61e3b5
- Scaffold commit: https://github.com/youngelie706-lgtm/Sure-earm/commit/07746c557c676650c8f0709c668151555c73659a
- UI + APIs commit: https://github.com/youngelie706-lgtm/Sure-earm/commit/431797dd9adb4d7043e49ba4cce531c6444f9945
- Admin+tasks/idempotency commit: https://github.com/youngelie706-lgtm/Sure-earm/commit/fbe882abec4f85e65a81923427e7e50896ef8759

## Files / areas added (high-level)
- package.json, next.config.js, tailwind/postcss config, tsconfig
- prisma/schema.prisma (User, Task, TaskCompletion, Transaction, Withdrawal)
- .env.example
- src/lib: db.ts, auth helpers, server-auth helper, validators
- src/pages: index, _app, auth (register/login/logout), dashboard, tasks (list + detail), wallet, referrals, admin
- src/pages/api: auth, user/me, tasks list & complete, wallet endpoints, referrals, admin tasks + withdrawals
- src/components: Header, TaskCard, BalanceDisplay, Loading, EmptyState
- Styling: Tailwind config + globals.css with requested palette (deep navy, electric blue, cyan, subtle gold)

## Security & correctness
- Passwords hashed with bcrypt (never store plaintext).
- Session JWT in HTTP-only cookie pattern (scaffold).
- Balances stored as integer kobo amounts to avoid floating point issues.
- Unique DB constraint (userId+taskId) and idempotencyKey prevent double claiming.
- Rewarding and withdrawal changes use DB transactions for atomicity.
- Withdrawal flow labeled DEMO; no real payment provider integrated.

## How to run locally (quick)
1. git clone https://github.com/youngelie706-lgtm/Sure-earm
2. cd Sure-earn
3. git checkout scaffold/sure-earn
4. cp .env.example .env  (edit DATABASE_URL + JWT_SECRET)
5. npm install
6. npx prisma migrate dev --name init
7. npm run dev
8. Open http://localhost:3000

## Checklist (what’s included vs. next work)
- Included:
  - Scaffolded app, models, core API flows, admin endpoints, basic UIs.
- Remaining / Recommended next work:
  - Task UI: proof upload, client idempotency persistence (localStorage), UX for pending/review.
  - Wallet: full withdrawal form wired to POST /api/wallet/withdraw & status updates.
  - Referrals: generate shareable referral link, server-side reward flow for referrals.
  - Admin: full task creation/editing UI and manual review queue for proof-required completions.
  - Validation & tests: add zod to all routes, integration tests for idempotency and balance invariants.
  - CI: add lint/test workflow.
  - Production: integrate payout provider (Paystack/Flutterwave), webhooks, KYC, rate-limiting, monitoring.

---

### How to create the draft PR (pick one)

Option A — One-click via browser
- Open: https://github.com/youngelie706-lgtm/Sure-earm/compare/main...scaffold/sure-earn?expand=1
- Click "Create pull request" and select "Create draft pull request".

Option B — GitHub CLI
- Save this file locally as PR_BODY.md, then run:
  gh pr create --title "feat(scaffold): Add Next.js + Prisma scaffold, dashboard, tasks, wallet, referrals, and admin UI (draft)" --body-file PR_BODY.md --base main --head scaffold/sure-earn --draft

If you'd like, I can also open the PR body file on your branch so the GH CLI command can use it with --body-file. Reply "Added PR_BODY.md" and I'll push it to the branch.