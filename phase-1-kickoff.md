# Phase 1 Kickoff — Skeleton

Read `CLAUDE.md` first. Confirm back to me that you understand the phase boundaries — especially what is **out of scope** for Phase 1.

## Phase 1 goal
A real, deployed app where a new user can:
**sign up → pay → log in → see Week 1 content.**

That's it. No video player. No weeks 2–10. No Drive integration. No Droplet. No automation. Don't scaffold for later phases.

## Order of operations
Do these in order. **Stop after each step** and let me review before moving on.

### 1. Initialize the repo
- Next.js (App Router, TypeScript, Tailwind, ESLint).
- Push to GitHub. Connect to Vercel. Confirm a deploy of the empty app actually loads.
- Create `.env.example` with placeholders for the Supabase and Stripe keys we'll need.

### 2. Supabase auth
- Create the Supabase client/server helpers under `/lib/supabase`.
- Sign up + log in flows with email/password.
- An `/account` page that shows the logged-in user's email and a sign-out button.
- Don't create the entitlements table yet — that's the next step.

### 3. Entitlements table + protected route
- Supabase table for paid access (e.g. `entitlements` with `user_id`, `status`, `created_at`). Propose the schema before creating it.
- `/week-1` route: server-side check. If the user has an active entitlement, render hardcoded Week 1 content (a heading and placeholder text is fine). If not, redirect to `/checkout`.

### 4. Stripe checkout
- One product, one price (the program). Test mode.
- `/checkout` page that creates a Checkout Session and redirects.
- Stripe webhook at `/api/stripe/webhook` that, on `checkout.session.completed`, inserts an entitlement row for the right user.
- Match by `client_reference_id` we pass into the Checkout Session — **explain the trade-off vs. matching by email before we commit to it**.

### 5. End-to-end test
- Walk the full path in Stripe test mode: new account → checkout → webhook fires → `/week-1` renders.
- Document the env vars and the Stripe webhook setup steps in `README.md`.

## Before you write any code
Reply with:
1. A short plan for **step 1 only**.
2. Any questions or assumptions I should resolve up front.
3. A list of accounts / keys you'll need from me (Supabase project URL + anon key + service role key, Stripe publishable + secret keys, Stripe webhook secret, etc.) and the order I should hand them over.

Don't start coding until I confirm.
