# SaaS Template: Project Management Tool

A modern, full-stack SaaS starter built with **Next.js 16 (App Router)**. This project features a tiered subscription model (Free vs. Pro) using Stripe, secure authentication with Auth.js, and a robust PostgreSQL database via Neon.

**Live Demo:** [https://cpatrick-saas-demo.vercel.app/](https://cpatrick-saas-demo.vercel.app/)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Neon (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth v5)
- **Payments:** Stripe (Checkout, Webhooks, Customer Portal)
- **Styling:** Tailwind CSS, Lucide React (Icons), React Hot Toast (Notifications)

## Key Features

- **Secure Authentication:** GitHub OAuth and Email/Password login (hashed with bcrypt).
- **Subscription Gating:**
  - **Free:** Limited to 1 project.
  - **Pro ($10/mo):** Unlimited projects.
- **Project Dashboard:** Responsive grid layout for managing project data.
- **Stripe Integration:** Automated checkout flows and webhook handling for subscription status updates.
- **Type-Safe Database:** Full TypeScript support with Prisma Client.

## Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/cpatrick321/saas-template.git](https://github.com/cpatrick321/saas-template.git)
cd saas-template
```

### 2. Install dependencies

```
npm install
# or
pnpm install
# or
yarn install
```

### 3. Environment Setup

Create a .env:

```
DATABASE_URL=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

and a .env.local:

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_URL=
AUTH_TRUST_HOST=true
```

### 4. Database Setup

```
npx prisma db push
```

### 5. Run the application

```
npm run dev
```

## Stripe Webhook Setup (Local Development)

#### 1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli).

#### 2. Login: 
```
stripe login
```

#### 3. Listen for events:
```
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### 4. Copy the webhook signing secret output by the CLI into your .env file under STRIPE_WEBHOOK_SECRET

