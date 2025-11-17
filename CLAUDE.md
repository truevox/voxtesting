# CLAUDE.md - Pascal's Ledger Website Development Guide

## Project Overview

Pascal's Ledger is a cryptographic identity verification and digital preservation service based on ancestor simulation theory. The platform allows users to create timestamped, cryptographic hashes that serve as proof of existence and identity verification for potential future AI reconstructions.

## Core Mission

Build a modern, secure, and user-friendly website that:
1. Explains the philosophical and technical foundations of Pascal's Ledger
2. Allows users to generate cryptographic hashes (Standard and Premium tiers)
3. Processes payments ($1 one-time for Standard, $5/year for Premium)
4. Stores hashes redundantly across multiple storage systems
5. Provides QR code generation for hash verification
6. Implements Pascal's Entropy Chain (PEC) for Premium mobile users

## Technology Stack Preferences

### Frontend
- **React** or **Next.js** for modern, SEO-friendly web application
- **TypeScript** for type safety and code quality
- **Tailwind CSS** for responsive, modern UI design
- Mobile-first design approach (critical for PEC Mobile integration)

### Backend
- **Node.js** with **Express** or **Next.js API routes**
- **PostgreSQL** for user accounts and metadata storage
- **Redis** for session management and rate limiting
- RESTful API design with JWT authentication

### Cryptography
- **BLAKE3** - Primary hashing algorithm (all users)
- **SHA-256** - Secondary hashing algorithm (all users)
- **SPHINCS+** - Quantum-resistant signature scheme (Premium users only)
- Use established libraries: `blake3`, `crypto` (Node.js built-in), `sphincs` or similar

### Storage & Redundancy
Implement multi-layered storage per the 100-Year Hash Trust Plan:
- **Primary Cloud**: AWS S3, Google Cloud Storage
- **Decentralized**: IPFS, Arweave, Internet Archive integration
- **Blockchain**: Bitcoin/Ethereum transaction embedding (optional)
- **Physical**: Generate downloadable certificates for laser etching, M-DISC, archival paper

### Payment Processing
- **Stripe** for credit/debit card processing
- Support one-time payments ($1 Standard) and annual subscriptions ($5 Premium)
- Clear cancellation policy: hashes persist forever, updates stop when subscription ends

### Mobile Integration (Premium - PEC)
- Progressive Web App (PWA) capabilities
- Access device sensors via Web APIs:
  - Temperature (if available)
  - Magnetometer
  - Barometer
  - Precise timestamps
  - Location (optional, privacy-conscious)
- Daily rolling hash updates for Premium users

## Key Features to Implement

### 1. User Authentication & Account Management
- Email/password registration with verification
- OAuth integration (Google, GitHub) optional
- Account dashboard showing all generated hashes
- Download hash history and certificates

### 2. Hash Generation Interface
- **Text Input**: Single thought, journal entry, or any text
- **Photo Upload**: Hash images without storing them
- Display all generated hashes (BLAKE3, SHA-256, SPHINCS+ for Premium)
- Show timestamp with timezone
- Include environmental entropy metadata (weather, location-based)
- Generate QR code linking to public verification page

### 3. Premium Features (PEC Mobile)
- Daily automatic hash updates using device sensors
- Visual timeline of hash evolution
- Export hash chain history
- Public QR code with link to evolving hash

### 4. Public Verification Pages
- Anyone can scan QR code to verify hash authenticity
- Show hash creation timestamp and algorithm details
- Display hash metadata (without revealing source content)
- No login required for verification

### 5. Educational Content
- Interactive explainer on ancestor simulation theory
- Visual demonstration of how cryptographic hashing works
- Testimonials and use cases
- FAQ section addressing common concerns

### 6. Merchandise Integration (Pascal's ProofWear)
- Integration with print-on-demand services (Printful, Printify)
- Generate custom QR code Displates, plaques, apparel
- Laser-etched titanium plate ordering
- Archival paper certificate downloads

### 7. Legacy Premium (Optional Advanced Feature)
- Family tree integration
- Parent hash seeding for generational continuity
- Visual lineage display

## Security & Privacy Requirements

### Critical Security Principles
1. **Never store original text or images** - only hashes
2. **Hashes are one-way** - impossible to reverse-engineer content
3. **Publicly publish hashes** - transparency ensures redundancy
4. **No PII in hash metadata** - only timestamps and algorithm info
5. **End-to-end encryption** for any temporary data transmission

### Implementation Details
- Salt hashes with user-specific entropy + environmental data
- Rate limiting on hash generation (prevent spam/abuse)
- CAPTCHA or proof-of-work for free-tier protection
- SQL injection prevention (parameterized queries)
- XSS protection (sanitize all inputs)
- CSRF tokens for state-changing operations
- HTTPS everywhere (enforce TLS 1.3+)

## Database Schema Considerations

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tier VARCHAR(20) DEFAULT 'standard', -- 'standard' or 'premium'
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_end_date TIMESTAMP NULL,
  pec_enabled BOOLEAN DEFAULT FALSE
);
```

### Hashes Table
```sql
CREATE TABLE hashes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  blake3_hash VARCHAR(64) NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  sphincs_signature TEXT NULL, -- Premium only
  timestamp TIMESTAMP NOT NULL,
  entropy_metadata JSONB, -- weather, sensors, etc.
  qr_code_url TEXT,
  public_verification_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### PEC Rolling Hashes (Premium)
```sql
CREATE TABLE pec_rolling_hashes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  parent_hash_id UUID REFERENCES hashes(id),
  current_blake3 VARCHAR(64) NOT NULL,
  current_sha256 VARCHAR(64) NOT NULL,
  current_sphincs TEXT NOT NULL,
  sensor_data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environmental Entropy Integration

### Standard Users
- Fetch weather data from free API (OpenWeatherMap, WeatherAPI)
- Include: temperature, humidity, pressure, conditions
- Use user's IP geolocation or optional manual location entry
- Combine with timestamp for unique environmental fingerprint

### Premium Users (PEC)
Access device sensors via JavaScript Web APIs:
```javascript
// Example sensor access
navigator.geolocation.getCurrentPosition()
navigator.sensors.AmbientLightSensor()
navigator.sensors.Magnetometer()
navigator.sensors.Gyroscope()
```

## Testing Strategy

### Unit Tests
- Hash generation functions (verify correct algorithm outputs)
- Entropy collection and formatting
- Payment processing logic

### Integration Tests
- User registration → hash generation → storage → retrieval flow
- Payment processing → tier upgrade → premium features unlocked
- QR code generation → public verification page rendering

### Security Tests
- Penetration testing for common vulnerabilities
- Verify hashes cannot be reverse-engineered
- Test rate limiting and abuse prevention

### Performance Tests
- Load testing for concurrent hash generation
- Database query optimization
- CDN caching for static content

## Development Workflow

### Git Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Individual features
- `hotfix/*` - Critical production fixes

### Code Review Requirements
- All changes require pull request review
- Security-sensitive code requires two approvals
- Automated tests must pass before merge

### Deployment Strategy
- Staging environment mirrors production
- Blue-green deployment for zero-downtime updates
- Automated backup before each deployment

## Charitable & Nonprofit Alignment

### 20% Charitable Allocation
The website should include:
- Transparency page showing real-time charity donations
- Breakdown of revenue allocation (per 100-Year Hash Trust Plan)
- Links to supported charities:
  - Make-A-Wish Foundation
  - 350.org
  - SENS Foundation
  - Long Now Foundation
  - Child's Play

### Public Benefit Corporation Messaging
- Clearly communicate PBC status and nonprofit transition plan
- Financial transparency dashboard
- Mission-first messaging throughout website

## Accessibility & User Experience

### Accessibility Standards
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios meet standards
- Alt text for all images

### User Experience Priorities
1. **Simplicity** - Hash generation should take < 30 seconds
2. **Clarity** - No technical jargon without explanations
3. **Trust** - Security and privacy messaging prominent
4. **Speed** - Page load times < 2 seconds
5. **Mobile-first** - 70%+ of users will be on mobile

## Documentation Requirements

### User Documentation
- Getting Started guide
- FAQ covering simulation theory, security, pricing
- Video tutorials for hash generation
- API documentation (if exposing public API)

### Developer Documentation
- Architecture decision records (ADRs)
- API endpoint documentation
- Database schema documentation
- Deployment runbook

## Performance & Scalability

### Expected Traffic
- Start: 100-1,000 users in first year
- Goal: 10,000-100,000 users within 5 years
- Viral potential: Design for 10x traffic spikes

### Optimization Strategies
- Static asset CDN (CloudFlare, Fastly)
- Database connection pooling
- Redis caching for frequent queries
- Lazy loading for images and heavy content
- Code splitting for faster initial load

## Legal & Compliance

### Required Legal Pages
- Terms of Service
- Privacy Policy (GDPR, CCPA compliant)
- Cookie Policy
- Refund Policy (if applicable)
- Data Retention Policy

### PII Handling
- Minimal data collection
- Right to deletion (with hash preservation)
- Data export on request
- Clear consent mechanisms

## Monitoring & Analytics

### Application Monitoring
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, Datadog)
- Uptime monitoring (Pingdom, UptimeRobot)

### Business Analytics
- User acquisition funnel
- Conversion rates (Standard → Premium)
- Hash generation metrics
- Geographic distribution
- Retention and churn rates

## Future Enhancements

### Phase 2 Features
- API for third-party integrations
- Bulk hash generation
- Family/organization accounts
- White-label solutions for enterprises

### Phase 3 Features
- Decentralized identity verification
- Integration with Web3 wallets
- AI-powered identity reconstruction demos
- Collaborative research platform

## Design Philosophy

### Visual Identity
- **Professional yet approachable** - Balance technical credibility with accessibility
- **Future-forward aesthetic** - Reflect cutting-edge technology
- **Trust signals** - Security badges, testimonials, transparency
- **Philosophical depth** - Honor Blaise Pascal's legacy

### Color Palette Suggestions
- Deep blues (trust, technology)
- Gold accents (ledger, value, permanence)
- White space (clarity, simplicity)
- Dark mode support (modern UX expectation)

### Typography
- Clean, readable sans-serif for body text
- Distinctive serif for headings (nod to Pascal's era)
- Monospace for hashes and technical content

## Questions to Resolve During Development

1. Should we offer API access for automated hash generation?
2. What's the minimum viable product (MVP) feature set?
3. How do we handle users who want to delete their accounts but preserve hashes?
4. Should we implement two-factor authentication (2FA)?
5. What's the backup strategy if primary storage providers fail?
6. How do we verify weather API data hasn't been manipulated?
7. Should we allow anonymous hash generation?

## Getting Started

When beginning development:
1. Review Pascal's Ledger.md thoroughly
2. Set up local development environment
3. Create database schema and migrations
4. Implement core hash generation logic first
5. Build authentication and user management
6. Add payment processing
7. Develop frontend UI
8. Integrate storage redundancy
9. Add Premium PEC features
10. Launch with MVP, iterate based on user feedback

## Contact & Collaboration

For technical decisions requiring input:
- Refer to philosophical foundations in Pascal's Ledger.md
- Prioritize security and user privacy
- Balance feature richness with simplicity
- Align all decisions with PBC mission and nonprofit goals

---

**Remember**: Pascal's Ledger isn't just a website—it's a philosophical experiment, a cryptographic milestone, and a bridge to the future. Every line of code contributes to preserving human identity across centuries.
