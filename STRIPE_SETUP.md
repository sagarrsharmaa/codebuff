# Stripe Setup Guide

## Prerequisites

- A [Stripe account](https://dashboard.stripe.com/register) (free)
- [Stripe CLI](https://docs.stripe.com/stripe-cli) installed locally
  ```bash
  brew install stripe/stripe-cli/stripe   # macOS
  # or: https://docs.stripe.com/stripe-cli#install
  ```

---

## Step 1: Get API keys

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ensure you're in **Test mode** (toggle in the top-left corner)
3. Go to **Developers → API keys**
4. Copy the **Secret key** (starts with `sk_test_`)
5. Add it to your `.env`:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
```

---

## Step 2: Create products and prices

### Option A: Using the Stripe CLI (fastest)

```bash
# 1. Log in
stripe login

# 2. Create products (save the returned product IDs)
stripe products create --name="Starter" --description="Starter Plan"
# → Returns: {"id": "prod_xxx", ...}
stripe products create --name="Pro" --description="Pro Plan"
# → Returns: {"id": "prod_yyy", ...}

# 3. Create prices — replace PROD_ID with the actual IDs from step 2

# Starter — Monthly ($29/mo)
stripe prices create \
  --unit-amount=2900 \
  --currency=usd \
  --recurring='{"interval":"month"}' \
  --product=prod_xxx

# Starter — Yearly ($23/mo billed annually = $276/yr)
stripe prices create \
  --unit-amount=27600 \
  --currency=usd \
  --recurring='{"interval":"year"}' \
  --product=prod_xxx

# Pro — Monthly ($99/mo)
stripe prices create \
  --unit-amount=9900 \
  --currency=usd \
  --recurring='{"interval":"month"}' \
  --product=prod_yyy

# Pro — Yearly ($79/mo billed annually = $948/yr)
stripe prices create \
  --unit-amount=94800 \
  --currency=usd \
  --recurring='{"interval":"year"}' \
  --product=prod_yyy
```

Each `stripe prices create` command returns a price ID (`price_xxx`). Copy all four — you'll need them in Step 3.

### Option B: Using the Stripe Dashboard

1. Go to **Products → Add Product**
2. Name: `Starter`, Description: `Starter Plan`
3. Pricing model: **Recurring**
4. Add two prices:
   - **Monthly**: $29.00 USD, billing period: Monthly
   - **Yearly**: $276.00 USD ($23/mo), billing period: Yearly
5. Save → repeat for **Pro** ($99/mo, $948/yr)

---

## Step 3: Set environment variables

Add the following to your `.env` file:

```bash
# Stripe API key (from Step 1)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# Webhook secret (you'll get this in Step 4 — come back after)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Price IDs (from Step 2 — replace with your actual price IDs)
STRIPE_PRICE_ID_STARTER_MONTHLY=price_1AbCDeFgHiJkLmNoP
STRIPE_PRICE_ID_STARTER_YEARLY=price_1AbCDeFgHiJkLmNoQ
STRIPE_PRICE_ID_PRO_MONTHLY=price_1AbCDeFgHiJkLmNoR
STRIPE_PRICE_ID_PRO_YEARLY=price_1AbCDeFgHiJkLmNoS
```

---

## Step 4: Set up webhook forwarding

Stripe needs to notify your app when payments succeed, subscriptions renew, etc. In development, the Stripe CLI forwards events to your local server.

```bash
# Terminal 1 — Start your Next.js dev server
npm run dev

# Terminal 2 — Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

When you run `stripe listen`, it prints:

```
Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxx
```

Copy that `whsec_...` value and paste it into `.env` as `STRIPE_WEBHOOK_SECRET`.

> **Keep both terminals running** while testing. Every time a Stripe event fires (payment, subscription change), you'll see it logged in the `stripe listen` terminal.

---

## Step 5: Restart and verify

```bash
# Kill and restart the dev server so it picks up the new env vars
# Then test that the pricing page loads
npm run dev
```

Verify the build compiles:

```bash
npm run build
```

---

## Testing end-to-end

### 1. Full user flow

| Step | Action | Expected result |
|------|--------|----------------|
| 1 | Visit `http://localhost:3000/pricing` | Pricing cards with Starter/Pro/Enterprise |
| 2 | Click **"Choose Pro"** | Redirected to `/signup?plan=pro&billing=monthly` |
| 3 | Fill in signup form and submit | Account created, redirected to `/pricing?plan=pro&billing=monthly` |
| 4 | Click **"Choose Pro"** again | Redirected to Stripe Checkout |
| 5 | Fill card: `4242 4242 4242 4242`, any future date, any CVV | Payment succeeds |
| 6 | Click "Return to merchant" | Redirected to `/dashboard/settings?checkout=success` |
| 7 | Scroll to **Billing & Plan** section | Shows "Pro — Monthly", status "Active", renewal date |
| 8 | Click **"Manage billing"** | Opens Stripe Customer Portal (cancel, upgrade, change card) |

### 2. Test without authentication

| Step | Action | Expected result |
|------|--------|----------------|
| 1 | Visit `http://localhost:3000/pricing` while logged out | Pricing cards visible |
| 2 | Click **"Choose Starter"** | Redirected to `/signup?plan=starter&billing=monthly` |

### 3. Test auth redirect protection

| Step | Action | Expected result |
|------|--------|----------------|
| 1 | Log out | — |
| 2 | Visit `http://localhost:3000/dashboard` | Redirected to `/login` |
| 3 | Visit `http://localhost:3000/dashboard/settings` | Redirected to `/login` |

### 4. Test billing portal (after subscribing)

| Step | Action | Expected result |
|------|--------|----------------|
| 1 | Go to `/dashboard/settings` | Billing section visible |
| 2 | Click **"Manage billing"** | Opens Stripe Customer Portal |
| 3 | In portal, click **"Cancel subscription"** | Subscription canceled |
| 4 | Return to `/dashboard/settings` | Status shows "Canceled" |
| 5 | Click **"Upgrade your plan"** | Goes to `/pricing` to re-subscribe |

### 5. Test webhook delivery

In the `stripe listen` terminal, you should see events like:

```
2024-01-01 12:00:00  → checkout.session.completed
2024-01-01 12:00:01  → customer.subscription.updated
```

If you don't see these, the webhook isn't forwarding — check that:
- `stripe listen` is running in a separate terminal
- The `STRIPE_WEBHOOK_SECRET` in `.env` matches what `stripe listen` printed
- The webhook route is correct: `localhost:3000/api/stripe/webhook`

---

## Test card numbers

| Card number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Success — payment completes |
| `4000 0025 0000 3155` | ✅ Requires 3DS authentication (test the redirect) |
| `4000 0000 0000 0002` | ❌ Declined — tests error handling |

Use any future expiry date and any 3-digit CVV.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| `STRIPE_SECRET_KEY is not set` | Missing env var | Add `STRIPE_SECRET_KEY` to `.env` |
| `Webhook signature verification failed` | Wrong `STRIPE_WEBHOOK_SECRET` | Copy the `whsec_...` from the `stripe listen` terminal |
| "No Stripe customer found" | User subscribed before portal was set up | The subscription will be created on first successful checkout |
| `400 Bad Request` on webhook | Webhook URL is wrong or server is down | Check `stripe listen` is forwarding to the right URL |
| Checkout redirects to `localhost` in production | `AUTH_URL` is wrong | Set `AUTH_URL=https://yourdomain.com` in production env |
| "Price ID not configured" | Env vars not set | Verify all 4 `STRIPE_PRICE_ID_*` env vars are in `.env` |

---

## Production checklist

When going live:

- [ ] Switch Stripe account from Test mode to Live mode
- [ ] Create new products/prices in Live mode (test prices don't work in production)
- [ ] Update `STRIPE_SECRET_KEY` with the live `sk_live_...` key
- [ ] Update `STRIPE_WEBHOOK_SECRET` with the live webhook secret
- [ ] Deploy the app, then configure the webhook endpoint in Stripe Dashboard → Developers → Webhooks (endpoint URL: `https://yourdomain.com/api/stripe/webhook`)
- [ ] Update `AUTH_URL` to your production domain
- [ ] Set `NODE_ENV=production`
