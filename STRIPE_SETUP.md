# Stripe Payment Integration Setup Guide

## 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process

## 2. Get Your API Keys
- Go to your Stripe Dashboard
- Navigate to Developers > API keys
- Copy your **Publishable key** and **Secret key** (use test keys for development)

## 3. Set Up Environment Variables
- Create a `.env.local` file in your project root
- Add your Stripe keys:
\`\`\`
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
\`\`\`

## 4. Create Products and Prices in Stripe
- Go to Stripe Dashboard > Products
- Create two products:
  - **Basic Plan**: $9.99/month
  - **Pro Plan**: $29.99/month
- Copy the Price IDs and update them in `app/page.tsx`:
  - Replace `price_basic_monthly` with your actual Basic plan Price ID
  - Replace `price_pro_monthly` with your actual Pro plan Price ID

## 5. Test the Integration
- Use Stripe's test card numbers:
  - **Success**: 4242 4242 4242 4242
  - **Decline**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## 6. Webhook Setup (Optional but Recommended)
- Go to Stripe Dashboard > Developers > Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `invoice.payment_succeeded`

## Key Files Explained

### `/app/api/checkout/route.ts`
- Creates Stripe checkout sessions
- Handles the payment flow initiation
- Redirects users to Stripe's secure payment page

### `/app/page.tsx`
- Main landing page with pricing cards
- Simple HTML forms that POST to the checkout API
- Educational content explaining the flow

### `/app/success/page.tsx` & `/app/cancel/page.tsx`
- Handle post-payment redirects
- Show appropriate messages based on payment outcome

## Security Notes
- Never expose your secret key in client-side code
- Always validate data on the server side
- Use HTTPS in production
- Implement proper error handling
