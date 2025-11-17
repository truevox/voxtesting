# ⚡ Quick Start - Deploy in 5 Minutes

## 1️⃣ Get a Database (2 minutes)

```bash
# Go to https://neon.tech
# Click "Sign up" (free, no credit card)
# Create a project
# Copy the connection string
```

Your connection string looks like:
```
postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 2️⃣ Initialize Database (1 minute)

Go to Neon SQL Editor and paste this:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tier VARCHAR(20) DEFAULT 'standard' CHECK (tier IN ('standard', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_end_date TIMESTAMPTZ NULL,
  pec_enabled BOOLEAN DEFAULT FALSE,
  stripe_customer_id VARCHAR(255) NULL,
  stripe_subscription_id VARCHAR(255) NULL
);

CREATE TABLE hashes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blake3_hash VARCHAR(64) NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  sphincs_signature TEXT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  entropy_metadata JSONB NOT NULL,
  qr_code_url TEXT NOT NULL,
  public_verification_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pec_rolling_hashes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
  current_blake3 VARCHAR(64) NOT NULL,
  current_sha256 VARCHAR(64) NOT NULL,
  current_sphincs TEXT NOT NULL,
  sensor_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hash_storage_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
  storage_type VARCHAR(50) NOT NULL,
  storage_url TEXT NOT NULL,
  stored_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'failed'))
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_hashes_user_id ON hashes(user_id);
CREATE INDEX idx_hashes_blake3 ON hashes(blake3_hash);
CREATE INDEX idx_hashes_sha256 ON hashes(sha256_hash);
CREATE INDEX idx_pec_user_id ON pec_rolling_hashes(user_id);
CREATE INDEX idx_storage_hash_id ON hash_storage_locations(hash_id);
CREATE INDEX idx_payments_user_id ON payment_transactions(user_id);
```

Click "Run" ✅

## 3️⃣ Get API Keys (1 minute)

### Weather API (Free)
1. Go to https://openweathermap.org/api
2. Sign up free
3. Get API key from dashboard

### Stripe (Optional for testing)
1. Go to https://dashboard.stripe.com/register
2. Get test keys: `sk_test_...` and `pk_test_...`
3. (Skip for now if you just want to test the app)

## 4️⃣ Deploy to Netlify (1 minute)

### Option A: Netlify UI Deploy

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your repository
4. Set **Base directory** to `pascals-ledger`
5. Build command: `npm run build`
6. Publish directory: `.next`

### Option B: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# From the pascals-ledger directory
cd pascals-ledger
netlify deploy --prod
```

## 5️⃣ Set Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

### REQUIRED (Minimum to run)

```env
DATABASE_URL=postgresql://... (from Step 1)
JWT_SECRET=run-this-command-to-generate
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
OPENWEATHER_API_KEY=your-key (from Step 3)
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### OPTIONAL (For payments)

```env
STRIPE_SECRET_KEY=your_stripe_test_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_test_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret_from_stripe
```

## 6️⃣ Redeploy

After setting environment variables:
```bash
# In Netlify UI: Click "Trigger deploy" → "Deploy site"
# Or via CLI:
netlify deploy --prod
```

## ✅ Done!

Your site is live at: `https://your-site.netlify.app`

### Test it:

1. **Register**: Go to `/register`
2. **Login**: Use your credentials
3. **Generate Hash**: Enter some text, click generate
4. **View QR Code**: See your cryptographic proof!

## 🚨 Troubleshooting

### "JWT_SECRET environment variable is required"
- Generate a secret: `openssl rand -hex 64`
- Add it to Netlify environment variables
- Redeploy

### "Database connection failed"
- Check DATABASE_URL is correct
- Make sure it includes `?sslmode=require`
- Verify database is running in Neon

### "NEXT_PUBLIC_APP_URL environment variable is required"
- Set to your Netlify URL: `https://your-site.netlify.app`
- Redeploy

### Build fails
- Check Netlify build logs
- Ensure all required env vars are set
- Try local build: `npm run build`

## 📝 Next Steps

- [ ] Set up custom domain
- [ ] Configure Stripe for real payments
- [ ] Set up monitoring
- [ ] Add SSL certificate (automatic with Netlify)
- [ ] Test all features

## 💡 Pro Tips

1. **Use Neon's free tier** - Perfect for testing
2. **Start with Stripe test mode** - Don't use real money yet
3. **Test locally first**: `npm run dev`
4. **Check logs**: `netlify logs` or Netlify UI
5. **Monitor usage**: Neon and Netlify dashboards

---

**Need help?** Check `DEPLOY.md` for detailed guide or open an issue!
