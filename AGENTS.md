# AGENTS.md - Pascal's Ledger Development Guidelines for AI Agents

## Purpose of This Document

This file provides instructions, context, and guidelines for AI agents (other than Claude) that may contribute to the Pascal's Ledger project. Whether you're an LLM-based coding assistant, automated code reviewer, or specialized AI tool, this document will help you understand the project and contribute effectively.

## Project Identity

**Project Name**: Pascal's Ledger
**Type**: Cryptographic identity verification and digital preservation service
**Legal Structure**: Public Benefit Corporation (PBC) → transitioning to 501(c)(3) nonprofit
**Mission**: Provide future-proof cryptographic proof of existence for ancestor simulation verification

## Core Concept (Quick Summary)

Pascal's Ledger creates timestamped cryptographic hashes of user-submitted content (text or images) that serve as verification markers for potential future AI reconstructions. The service operates on the philosophical premise of ancestor simulation theory—that advanced future civilizations may simulate past individuals, and these hashes provide cryptographic proof of authenticity.

**Key Point**: We store ONLY hashes, never the original content. Hashes are irreversible, ensuring complete privacy.

## Your Role as an AI Agent

When working on this project, you should:

1. **Prioritize security and privacy** - This is non-negotiable
2. **Maintain cryptographic integrity** - Hashing must be deterministic and verifiable
3. **Think long-term** - Code must be maintainable for decades
4. **Respect the mission** - All decisions align with PBC values and nonprofit goals
5. **Write self-documenting code** - Future developers need to understand your work

## Critical Security Rules

### NEVER Do These Things
❌ Store plaintext user inputs (text or images)
❌ Log hash pre-images or intermediate states
❌ Expose private keys or cryptographic seeds
❌ Implement custom cryptography (use established libraries)
❌ Skip input validation or sanitization
❌ Hard-code credentials or API keys
❌ Disable security features "temporarily"
❌ Allow SQL injection vulnerabilities
❌ Permit XSS attacks
❌ Accept unvalidated user input in shell commands

### ALWAYS Do These Things
✅ Use parameterized database queries
✅ Validate and sanitize ALL user inputs
✅ Implement rate limiting on all endpoints
✅ Use HTTPS/TLS for all communications
✅ Hash passwords with bcrypt or Argon2
✅ Implement CSRF protection
✅ Set secure HTTP headers
✅ Log security-relevant events (failed logins, etc.)
✅ Use environment variables for secrets
✅ Follow principle of least privilege

## Technology Stack Overview

### Frontend
- React/Next.js with TypeScript
- Tailwind CSS for styling
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities for Premium PEC users

### Backend
- Node.js with Express or Next.js API routes
- PostgreSQL for relational data
- Redis for caching and session management
- RESTful API design

### Cryptography Libraries
- **BLAKE3**: Use `blake3` npm package
- **SHA-256**: Use Node.js built-in `crypto` module
- **SPHINCS+**: Use established quantum-resistant signature library

### Infrastructure
- Cloud storage: AWS S3, Google Cloud Storage
- Decentralized: IPFS, Arweave
- Payment: Stripe API
- Weather API: OpenWeatherMap or WeatherAPI.io

## Hash Generation Process (Core Algorithm)

When implementing hash generation, follow this flow:

```
1. Receive user input (text or image)
2. Collect environmental entropy:
   - Precise timestamp (ISO 8601 format)
   - Weather data (temp, pressure, humidity) via API
   - User location (IP-based or optional GPS)
   - Premium: Device sensor data (magnetometer, barometer, etc.)
3. Combine input + entropy into structured format
4. Generate BLAKE3 hash of combined data
5. Generate SHA-256 hash of combined data
6. Premium: Generate SPHINCS+ signature
7. Store ONLY the hashes + metadata (NOT the input)
8. Generate QR code linking to public verification URL
9. Save to database and redundant storage
10. Return hashes to user with timestamp
```

### Example Hash Input Structure
```json
{
  "content_hash": "sha256_of_user_input",
  "timestamp": "2025-11-17T14:32:15.123Z",
  "entropy": {
    "location": {
      "city": "San Francisco",
      "country": "US",
      "lat": 37.7749,
      "lon": -122.4194
    },
    "weather": {
      "temp_celsius": 18.5,
      "pressure_hpa": 1013.25,
      "humidity_percent": 65
    },
    "sensors": { // Premium only
      "magnetometer": {"x": 0.12, "y": -0.34, "z": 0.56},
      "barometer_hpa": 1013.28
    }
  },
  "user_id": "uuid",
  "tier": "premium"
}
```

## API Endpoint Guidelines

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and return JWT
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/verify` - Verify email address
- `POST /api/auth/reset-password` - Password reset flow

### Hash Generation Endpoints
- `POST /api/hash/create` - Generate new hash (authenticated)
- `GET /api/hash/:id` - Retrieve specific hash (authenticated)
- `GET /api/hash/list` - List user's hashes (authenticated, paginated)
- `GET /api/hash/verify/:id` - Public hash verification (no auth required)

### Premium/PEC Endpoints
- `POST /api/pec/update` - Update rolling hash (Premium, daily limit)
- `GET /api/pec/history` - Get PEC hash timeline (Premium)
- `GET /api/pec/qr-code` - Get current QR code (Premium)

### Payment Endpoints
- `POST /api/payment/create-checkout` - Initiate Stripe checkout
- `POST /api/payment/webhook` - Stripe webhook handler
- `GET /api/payment/subscription-status` - Check subscription status

### Public Endpoints (No Auth)
- `GET /api/public/verify/:hash` - Verify hash authenticity
- `GET /api/public/stats` - Public statistics (total hashes, users)

## Database Schema Reference

### Key Tables

**users**
- `id` (UUID, primary key)
- `email` (VARCHAR, unique)
- `password_hash` (VARCHAR)
- `tier` ('standard' | 'premium')
- `created_at` (TIMESTAMP)
- `subscription_end_date` (TIMESTAMP, nullable)
- `pec_enabled` (BOOLEAN)

**hashes**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `blake3_hash` (VARCHAR(64))
- `sha256_hash` (VARCHAR(64))
- `sphincs_signature` (TEXT, nullable)
- `timestamp` (TIMESTAMP)
- `entropy_metadata` (JSONB)
- `qr_code_url` (TEXT)
- `public_verification_url` (TEXT)
- `created_at` (TIMESTAMP)

**pec_rolling_hashes** (Premium only)
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `parent_hash_id` (UUID, foreign key → hashes)
- `current_blake3` (VARCHAR(64))
- `current_sha256` (VARCHAR(64))
- `current_sphincs` (TEXT)
- `sensor_data` (JSONB)
- `updated_at` (TIMESTAMP)

## Code Style & Standards

### General Principles
- **TypeScript strict mode** enabled
- **ESLint** and **Prettier** for code formatting
- **Functional programming** preferred where appropriate
- **Pure functions** for hash generation (no side effects)
- **Comprehensive error handling** (try/catch, proper error responses)
- **Logging** for debugging and auditing (use Winston or similar)

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes and types
- `UPPER_SNAKE_CASE` for constants
- `kebab-case` for file names
- Descriptive names (e.g., `generateBlake3Hash` not `genHash`)

### Comment Standards
```typescript
/**
 * Generates a BLAKE3 hash with environmental entropy
 *
 * @param input - User-provided text or image buffer
 * @param entropy - Environmental data (weather, timestamp, sensors)
 * @returns BLAKE3 hash as hex string (64 characters)
 * @throws {ValidationError} if input is invalid
 */
function generateBlake3Hash(input: string | Buffer, entropy: EntropyData): string {
  // Implementation...
}
```

## Testing Requirements

### Unit Tests
Every function that processes data must have unit tests covering:
- Valid inputs
- Invalid inputs
- Edge cases (empty strings, null values, extreme numbers)
- Error conditions

### Integration Tests
Test complete flows:
- User registration → email verification → first hash creation
- Payment processing → tier upgrade → premium feature access
- Hash generation → storage → retrieval → public verification

### Security Tests
- SQL injection attempts
- XSS payloads
- CSRF token validation
- Rate limiting effectiveness
- Authentication bypass attempts

### Use Jest or Mocha for testing
```typescript
describe('generateBlake3Hash', () => {
  it('should generate deterministic hash for same input', () => {
    const input = 'test input';
    const entropy = mockEntropyData();
    const hash1 = generateBlake3Hash(input, entropy);
    const hash2 = generateBlake3Hash(input, entropy);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hash with different entropy', () => {
    const input = 'test input';
    const entropy1 = mockEntropyData({ temp: 20.0 });
    const entropy2 = mockEntropyData({ temp: 20.1 });
    const hash1 = generateBlake3Hash(input, entropy1);
    const hash2 = generateBlake3Hash(input, entropy2);
    expect(hash1).not.toBe(hash2);
  });
});
```

## Error Handling Standards

### HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Unexpected server error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Hash input cannot be empty",
    "details": {
      "field": "content",
      "constraint": "non_empty"
    }
  }
}
```

### Error Logging
- **INFO**: Normal operations (user signup, hash creation)
- **WARN**: Unusual but handled events (rate limit hit, invalid login)
- **ERROR**: Unexpected errors (database connection failure)
- **CRITICAL**: Security incidents (repeated failed auth, suspected attack)

## Performance Optimization

### Database Queries
- Use indexes on frequently queried columns (`user_id`, `timestamp`, `email`)
- Implement pagination for list endpoints (max 100 results per page)
- Use connection pooling for database connections
- Cache frequently accessed data in Redis (user tiers, subscription status)

### Hash Generation
- Hash generation should complete in < 100ms (excluding network calls)
- Weather API calls should have 5-second timeout
- Use Promise.all() for parallel hash generation (BLAKE3 + SHA-256)

### Frontend Performance
- Code splitting for faster initial load
- Lazy load images and heavy components
- Optimize images (WebP format, responsive sizes)
- CDN for static assets
- Service worker for offline capabilities (PWA)

## Mobile Integration (PEC - Premium Users)

### Web APIs for Sensor Access
```javascript
// Magnetometer
const sensor = new Magnetometer({ frequency: 60 });
sensor.addEventListener('reading', () => {
  const { x, y, z } = sensor;
  // Use magnetometer data in entropy
});

// Ambient Light Sensor
const lightSensor = new AmbientLightSensor();
lightSensor.addEventListener('reading', () => {
  const illuminance = lightSensor.illuminance;
});

// Barometer (via Generic Sensor API if available)
```

### Privacy Considerations
- Request sensor permissions explicitly
- Explain why each sensor is needed
- Allow users to opt out of specific sensors
- Never transmit raw sensor data (only use in hash generation)

## Redundant Storage Implementation

### Storage Layers
1. **Primary Database** (PostgreSQL) - Immediate access
2. **Cloud Storage** (S3/GCS) - Automated daily backup
3. **IPFS** - Decentralized content-addressed storage
4. **Internet Archive** - Long-term preservation
5. **Blockchain** (optional) - Bitcoin/Ethereum timestamp anchoring

### Backup Schedule
- **Real-time**: PostgreSQL replication
- **Hourly**: Redis snapshot
- **Daily**: Full database backup to S3
- **Weekly**: IPFS pinning update
- **Monthly**: Internet Archive submission
- **Quarterly**: Blockchain anchoring (cost permitting)

## Payment Integration (Stripe)

### Standard Tier ($1 One-Time)
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Pascal\'s Ledger - Standard Tier',
        description: 'One-time cryptographic hash generation',
      },
      unit_amount: 100, // $1.00 in cents
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.BASE_URL}/cancel`,
});
```

### Premium Tier ($5/Year Subscription)
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_premium_yearly', // Created in Stripe dashboard
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: `${process.env.BASE_URL}/premium/success`,
  cancel_url: `${process.env.BASE_URL}/premium/cancel`,
});
```

### Webhook Handling
```javascript
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Upgrade user to Standard or Premium
      break;
    case 'customer.subscription.deleted':
      // Downgrade Premium user (hashes persist, updates stop)
      break;
    case 'invoice.payment_failed':
      // Notify user of failed payment
      break;
  }

  res.json({received: true});
});
```

## Charity Transparency Dashboard

### Display Real-Time Allocation
Show users how their payment is allocated:
- 20% → Charities (with breakdown)
- 25% → Redundant storage
- 40% → Conservative investments
- 5% → Crypto investments
- 10% → Operations

### Charity Breakdown (20%)
Each charity receives equal share (4% of total revenue):
1. Make-A-Wish Foundation
2. 350.org
3. SENS Foundation
4. Long Now Foundation
5. Child's Play

### Implementation
```typescript
interface RevenueAllocation {
  totalRevenue: number;
  charities: {
    name: string;
    percentage: number;
    amount: number;
  }[];
  storage: number;
  investments: {
    conservative: number;
    crypto: number;
  };
  operations: number;
}
```

## Accessibility Requirements (WCAG 2.1 Level AA)

### Must-Have Features
- Keyboard navigation support
- Screen reader compatibility (ARIA labels)
- Color contrast ratio ≥ 4.5:1 for normal text
- Alternative text for all images
- Captions for video content
- Skip navigation links
- Focus indicators on interactive elements
- Resizable text (up to 200%)
- No autoplay media

### Testing Tools
- axe DevTools
- WAVE browser extension
- Lighthouse accessibility audit
- Screen reader testing (NVDA, JAWS, VoiceOver)

## Internationalization (i18n) Considerations

### Phase 1 (Launch)
- English only
- USD pricing
- Date/time formatting (ISO 8601)

### Phase 2 (Future)
- Multi-language support (Spanish, French, German, Chinese, Japanese)
- Currency conversion
- Localized payment methods
- RTL language support (Arabic, Hebrew)

## Legal & Compliance

### Required Legal Pages
Ensure these pages exist and are legally reviewed:
- Terms of Service
- Privacy Policy (GDPR, CCPA compliant)
- Cookie Policy
- Refund Policy
- Data Retention Policy
- Acceptable Use Policy

### Data Handling
- **GDPR**: Right to access, deletion, portability, objection
- **CCPA**: California residents' privacy rights
- **Cookie Consent**: Clear opt-in for non-essential cookies
- **Age Verification**: Users must be 13+ (COPPA compliance)

### Data Retention
- User accounts: Indefinite (or until user requests deletion)
- Hashes: Permanent (even if account deleted)
- Payment records: 7 years (tax compliance)
- Logs: 90 days (security auditing)

## Monitoring & Observability

### Application Monitoring
```javascript
// Error tracking (Sentry example)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });
  next();
});
```

### Key Metrics to Track
- Hash generation rate (per hour/day/week)
- User registration rate
- Conversion rate (Standard → Premium)
- Average response time
- Error rate (by endpoint)
- Database query performance
- Payment success/failure rate
- Storage redundancy status

## Deployment & DevOps

### CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

### Environment Variables
Never commit these to version control:
```
DATABASE_URL=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
WEATHER_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
IPFS_API_KEY=
SESSION_SECRET=
JWT_SECRET=
SENTRY_DSN=
```

### Docker Deployment (Example)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Common Pitfalls to Avoid

1. **Storing plaintext inputs** - ONLY store hashes
2. **Using weak randomness** - Use crypto.randomBytes(), not Math.random()
3. **Ignoring rate limiting** - Prevents abuse and DDoS
4. **Poor error messages** - Don't expose internal details to users
5. **Hardcoding configuration** - Use environment variables
6. **Skipping input validation** - All user input is untrusted
7. **Inefficient database queries** - Use indexes and pagination
8. **Not testing edge cases** - Empty inputs, null values, extreme numbers
9. **Ignoring mobile users** - Mobile-first design is essential
10. **Neglecting documentation** - Code should be self-explanatory

## Communication & Collaboration

### When You Need Clarification
If you encounter ambiguous requirements:
1. Check Pascal's Ledger.md for philosophical context
2. Review CLAUDE.md for technical guidance
3. Follow security-first principle when in doubt
4. Document your assumptions in code comments
5. Flag ambiguities for human review

### Code Review Checklist
Before submitting code, verify:
- [ ] Security vulnerabilities checked
- [ ] Input validation implemented
- [ ] Error handling comprehensive
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] Accessibility standards met
- [ ] Code formatted with Prettier
- [ ] No secrets in code

## Project Philosophy

Remember that Pascal's Ledger is:
- **A philosophical experiment** in simulation theory
- **A public benefit corporation** with nonprofit goals
- **A 100-year commitment** to data preservation
- **A privacy-first service** that never stores user content
- **A bridge to the future** connecting present to future AI reconstructions

Every decision should reflect these core values. When in doubt, prioritize:
1. **Security & Privacy** - Protect user data at all costs
2. **Long-term thinking** - Build for decades, not months
3. **Mission alignment** - Does this serve the PBC goals?
4. **Simplicity** - Complexity is the enemy of maintainability
5. **Transparency** - Open about methods, charitable giving, finances

## Quick Reference Links

- **Main Documentation**: Pascal's Ledger.md
- **Claude Instructions**: CLAUDE.md
- **Agent Instructions**: AGENTS.md (this file)

## Version Control

- **Document Version**: 1.0
- **Last Updated**: 2025-11-17
- **Maintained By**: Project maintainers
- **Review Frequency**: Quarterly or as needed

---

**Welcome to the Pascal's Ledger project!** Your contributions help build a bridge between the present and a future where digital identity can persist across centuries. Code with care, think long-term, and prioritize the mission above all else.

🚀 Let's build something that lasts forever.
