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
- `/dashboard` — assigned program + 7-day week grid with completion tracking
- `/workout/[program]/[week]/[day]` — exercise list, notes, Mark Complete
- `/admin` — coach assigns programs, manages users (gated by ADMIN_EMAIL env var)

## How programs work
Users **do not** choose their program on the public site. The coach assigns a program inside `/admin`. The user sees it after logging in on `/dashboard`.

## Route groups
- `src/app/(app)/` — auth pages (log-in, sign-up, account). Gets `<Nav />` from its layout.
- `src/app/dashboard/`, `src/app/workout/`, `src/app/admin/` — app pages at root level. Each imports `<DashboardNav />` directly.
- `src/app/page.tsx` — public cover page. Uses `<LandingNav />`.
