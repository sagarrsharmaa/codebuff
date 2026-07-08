# Codebuff

**An AI developer platform landing page with authentication, dashboard, and Stripe billing.**

A production-grade Next.js 14 application showcasing a modern SaaS experience — from a polished landing page to a fully authenticated dashboard with subscription management.

---

## Features

### Landing Page
- Animated hero section with staggered reveal, 3D tilt dashboard mockup, and mesh gradient background
- Feature sections, timeline, testimonials carousel, FAQ accordion, and pricing tiers
- Glassmorphism UI design with custom Tailwind theme (dark mode)
- Smooth scroll via Lenis, cursor glow effect, magnetic buttons

### Authentication (Auth.js v5)
- Email/password signup and login with bcrypt password hashing
- Google OAuth integration
- Session management via JWT with server-side `auth()` and client-side `useSession`
- Protected routes via Next.js middleware — unauthenticated users redirected to `/login`
- Inline form validation with clear error states (no `alert()` popups)

### Dashboard
- Server-side data fetching from PostgreSQL via Prisma
- Account details card with real DB data (name, email, member since date)
- Usage metrics and activity chart with designed empty states for new users
- Settings page with:
  - Display name update
  - Password change (with current password verification)
  - Connected OAuth accounts overview
  - Account deletion with typed confirmation modal

### Billing (Stripe)
- Pricing section wired to real Stripe Checkout sessions
- Monthly/yearly billing toggle
- Stripe webhook handler for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Billing section in dashboard settings showing current plan, renewal date, and status
- Stripe Customer Portal integration via "Manage billing" button
- Plan selection preserved through signup/login flow (plan params forwarded as query strings)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) with custom dark theme |
| Animations | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/) |
| Auth | [Auth.js v5](https://authjs.dev/) (NextAuth) with Prisma adapter |
| Payments | [Stripe](https://stripe.com/) (Checkout, Webhooks, Customer Portal) |
| Fonts | Space Grotesk (display) + Inter (body) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (test mode)

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — Run `openssl rand -base64 32` to generate
- `STRIPE_SECRET_KEY` — From Stripe Dashboard (test mode)
- `STRIPE_PRICE_ID_*` — Price IDs from Stripe products (see `STRIPE_SETUP.md`)

### Install & Run

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Stripe Setup

See [`STRIPE_SETUP.md`](./STRIPE_SETUP.md) for full instructions on creating products, setting up webhook forwarding, and testing the checkout flow end-to-end.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── stripe/webhook/    # Stripe webhook handler
│   ├── dashboard/
│   │   ├── layout.tsx         # Auth-guarded dashboard layout
│   │   ├── page.tsx           # Dashboard overview (real DB data)
│   │   └── settings/
│   │       └── page.tsx       # Settings (name, password, billing, accounts)
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   └── pricing/               # Standalone pricing page
├── auth.ts                    # Auth.js configuration
├── components/
│   ├── auth/                  # Login/signup forms
│   ├── dashboard/             # Dashboard components (BillingSection, etc.)
│   ├── primitives/            # GlassCard, MagneticButton, SectionWrapper
│   └── sections/              # Landing page sections (Hero, Pricing, etc.)
└── lib/
    ├── auth-actions.ts        # Signup server action
    ├── dashboard-actions.ts   # Dashboard/server settings actions
    ├── stripe.ts              # Stripe client (lazy init)
    ├── stripe-actions.ts      # Checkout + billing portal actions
    ├── prisma.ts              # Prisma client
    └── utils.ts               # cn() helper
```
