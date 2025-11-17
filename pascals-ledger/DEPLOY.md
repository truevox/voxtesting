# 🚀 Deploying Pascal's Ledger to Netlify

## Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/truevox/voxtesting)

## Prerequisites

Before deploying, you need:

1. **PostgreSQL Database** (required)
   - [Neon](https://neon.tech) - Recommended, free tier available
   - [Supabase](https://supabase.com) - Alternative with free tier
   - [Railway](https://railway.app) - Another good option

2. **Stripe Account** (for payments)
   - Get API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

3. **OpenWeatherMap API Key** (for entropy)
   - Free tier at [OpenWeatherMap](https://openweathermap.org/api)

## Step-by-Step Deployment

### 1. Set Up Database

#### Using Neon (Recommended)

```bash
# 1. Sign up at https://neon.tech
# 2. Create a new project
# 3. Copy the connection string (starts with postgresql://)
# 4. Save it for step 3
```

#### Initialize Database Schema

Once you have your database URL, run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tier VARCHAR(20) DEFAULT 'standard' CHECK (tier IN ('standard', 'premium')),
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_end_date TIMESTAMP NULL,
  pec_enabled BOOLEAN DEFAULT FALSE,
  stripe_customer_id VARCHAR(255) NULL,
  stripe_subscription_id VARCHAR(255) NULL
);

-- Hashes table
CREATE TABLE hashes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blake3_hash VARCHAR(64) NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  sphincs_signature TEXT NULL,
  timestamp TIMESTAMP NOT NULL,
  entropy_metadata JSONB NOT NULL,
  qr_code_url TEXT NOT NULL,
  public_verification_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PEC Rolling Hashes table
CREATE TABLE pec_rolling_hashes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
  current_blake3 VARCHAR(64) NOT NULL,
  current_sha256 VARCHAR(64) NOT NULL,
  current_sphincs TEXT NOT NULL,
  sensor_data JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hash storage locations table
CREATE TABLE hash_storage_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
  storage_type VARCHAR(50) NOT NULL,
  storage_url TEXT NOT NULL,
  stored_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'failed'))
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_hashes_user_id ON hashes(user_id);
CREATE INDEX idx_hashes_blake3 ON hashes(blake3_hash);
CREATE INDEX idx_hashes_sha256 ON hashes(sha256_hash);
CREATE INDEX idx_pec_user_id ON pec_rolling_hashes(user_id);
CREATE INDEX idx_storage_hash_id ON hash_storage_locations(hash_id);
CREATE INDEX idx_payments_user_id ON payment_transactions(user_id);
```

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select the repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Branch to deploy**: `main` or your branch

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### 3. Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

#### Required Variables

```env
# Database (from Neon/Supabase)
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# JWT Authentication (generate a random 64-character string)
JWT_SECRET=your-super-secret-jwt-key-64-characters-minimum-change-this

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application URL (your Netlify domain)
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app

# Weather API (from OpenWeatherMap)
OPENWEATHER_API_KEY=your_openweathermap_api_key
```

#### How to Generate JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 64
```

### 4. Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://your-site.netlify.app/api/payment/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add it to Netlify as `STRIPE_WEBHOOK_SECRET`

### 5. Install Netlify Next.js Plugin

The plugin is specified in `netlify.toml`, but you may need to enable it:

```bash
npm install --save-dev @netlify/plugin-nextjs
```

Or in Netlify UI:
1. Go to Plugins
2. Search for "Next.js Plugin"
3. Install it

### 6. Trigger Deployment

After setting environment variables:

```bash
# Trigger a new build in Netlify
netlify deploy --prod

# Or push to your GitHub branch
git push origin main
```

## Post-Deployment Checklist

- [ ] Database schema initialized
- [ ] All environment variables set in Netlify
- [ ] Stripe webhook configured and tested
- [ ] Test user registration
- [ ] Test hash generation
- [ ] Test payment flow (use Stripe test mode first)
- [ ] Test QR code verification
- [ ] Check error logs in Netlify Functions

## Testing the Deployment

### 1. Test Registration
```bash
curl -X POST https://your-site.netlify.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### 2. Test Login
```bash
curl -X POST https://your-site.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### 3. Test Hash Generation
```bash
curl -X POST https://your-site.netlify.app/api/hash/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"inputType":"text","content":"Hello World"}'
```

## Troubleshooting

### Build Fails

Check Netlify build logs:
```bash
netlify logs
```

Common issues:
- Missing environment variables
- Database connection errors
- Node version mismatch (should be 18+)

### Database Connection Errors

Ensure your `DATABASE_URL`:
- Includes `?sslmode=require` for Neon
- Has correct username/password
- Database exists and is accessible

### Stripe Webhook Not Working

1. Check webhook URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Check Netlify function logs
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to https://your-site.netlify.app/api/payment/webhook
   ```

### Environment Variables Not Loading

- Make sure variables are set in Netlify, not just `.env` file
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

## Custom Domain

To use your own domain:

1. Go to Netlify → Domain settings
2. Add custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Update Stripe webhook URL to custom domain

## Monitoring

- **Netlify Analytics**: Built-in traffic monitoring
- **Netlify Functions Logs**: Check API errors
- **Stripe Dashboard**: Monitor payments
- **Database Monitoring**: Check Neon/Supabase dashboard

## Scaling Considerations

- **Database**: Neon free tier has limits, upgrade if needed
- **Netlify Functions**: 125k function invocations/month on free tier
- **Consider upgrading** when you hit:
  - 100+ daily active users
  - 1000+ API requests/day
  - Need faster build times

## Support

If you encounter issues:

1. Check Netlify build logs
2. Check Netlify function logs
3. Check database logs
4. Review environment variables
5. Open GitHub issue with error details

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy to Netlify
netlify deploy --prod

# View logs
netlify logs

# Open deployed site
netlify open

# Check build status
netlify status
```

---

**Ready to deploy?** Make sure you have:
- ✅ Database URL
- ✅ JWT Secret (64+ characters)
- ✅ Stripe API keys
- ✅ Weather API key
- ✅ All environment variables set

Then push to GitHub or run `netlify deploy --prod`!
