@AGENTS.md

# ProGrip JP — What This App Is

This is a **private workout app**, not a marketing website. Users receive login credentials from their coach. They log in and follow an assigned bareback rodeo training program day by day.

## Two sides only

### 1. Public side (logged-out visitors)
- A single cover page (`/`) that introduces ProGrip JP
- Log In and Sign Up buttons in the nav
- That is it.

**Do NOT build or restore:**
- A public /programs page with cards or dropdowns
- A public /workouts page with category cards
- A public /coach page
- Pricing cards, intensity selectors, sales CTAs, or feature lists on the cover page

### 2. App side (after login — the real product)

3-level navigation structure:

**Level 1 — `/dashboard`** (program selector)
- Shows 4 program cards: 10 Week Foundation, 3 Month Builder, 6 Month Elite, 1-on-1 Coaching
- All 4 are clickable by any logged-in user (paywall via Stripe comes later — do NOT add access restrictions now)
- Clicking a card → `/dashboard/[program]`

**Level 2 — `/dashboard/[program]`** (week grid)
- Shows the 7-day grid for the current week
- `current_week` comes from profile only when `profile.assigned_program === program`; otherwise defaults to 1
- "← Back to Programs" button → `/dashboard`

**Level 3 — `/workout/[program]/[week]/[day]`** (workout detail)
- Exercise table with Done checkboxes, notes, Mark Complete
- "← Back" button → `/dashboard/[program]`

**Other app pages:**
- `/coach` — Meet the Coach (auth-protected, logged-in users only)
- `/admin` — coach assigns programs and current_week per user (gated by ADMIN_EMAIL env var)

## How programs work
The coach assigns one program per user inside `/admin`. That sets `assigned_program` and `current_week` on the user's profile. Users can browse any program on the selector page, but only their assigned program tracks week progress automatically.

**Future:** When Stripe is integrated, restrict program access based on purchase. Currently all users see all 4 programs.

## Route groups
- `src/app/(app)/` — auth pages (log-in, sign-up, account). Gets `<Nav />` from its layout.
- `src/app/dashboard/`, `src/app/dashboard/[program]/`, `src/app/workout/`, `src/app/admin/`, `src/app/coach/` — app pages at root level. Each imports `<DashboardNav />` directly.
- `src/app/page.tsx` — public cover page. Uses `<LandingNav />`.

## Future Features (not yet built)
- **Workout Library** — completed workouts stay accessible for revisit (lifetime or additional subscription, TBD)
- **Stripe paywall** — restrict program access based on purchase (currently all programs visible to all logged-in users)
- **Voice notes** — text-only session notes for now; voice recording in Phase 2
