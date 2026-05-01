# 📄 Product Requirements Document — Invoizemo

**Version:** 1.0 | **Date:** May 2026 | **Status:** Draft

---

## 1. Product Overview

**Product Name:** Invoizemo
**Industry:** Business Finance / Document Automation
**Tagline:** Create. Send. Get Paid.

Invoizemo is a web-based SaaS platform for freelancers, agencies, and small businesses to generate professional invoices, send proposals, and apply digital signatures — all from one dashboard.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Enable invoice creation in < 2 minutes | Time-to-first-invoice < 120s |
| Support recurring & one-off billing workflows | Invoice status coverage: Draft / Published / Archived |
| Reduce unpaid invoices | Download + send flow completion rate |
| Retain users with a free tier | Free Forever plan DAU |

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| **Frontend** | React (Next.js), TailwindCSS |
| **Backend** | Node.js, Express |
| **Auth** | Email-based only (JWT — access 15m / refresh 7d in HttpOnly cookie) |
| **Database** | MongoDB (Mongoose ODM) |
| **Color Theme** | `#1947a8` (Primary Blue) |
| **Deploy: Frontend** | Vercel |
| **Deploy: Backend** | Render / Railway |
| **Deploy: DB** | MongoDB Atlas |
| **Theme Engine** | Light/Dark/System + Customizable Primary Color via CSS Variables |
| **Storage** | Cloudinary / S3 (for Logos) or Base64 (v1 fallback) |

---

## 4. User Roles

| Role | Description |
|---|---|
| `guest` | Can view landing, pricing, about pages |
| `user` | Authenticated — full access to dashboard, invoices, templates |

---

## 5. Pages

### 5.1 Public Pages

| Page | Path | Description |
|---|---|---|
| Home | `/` | Header + Hero section |
| About | `/about` | Company/product story |
| Contact Us | `/contact` | Contact form |
| Privacy Policy | `/privacy` | Legal page |
| Pricing | `/pricing` | Pricing table (Free Forever + $6/mo plan) |

### 5.2 Auth Pages

| Page | Path |
|---|---|
| Sign Up | `/signup` |
| Login | `/login` |
| Forgot Password | `/forgot-password` |

### 5.3 App Pages (Protected)

| Page | Path | Description |
|---|---|---|
| Dashboard | `/dashboard` | Recent invoices, stats, status overview |
| Create Invoice | `/invoice/create` | Template selector → customization → preview |
| Invoice Detail | `/invoice/[id]` | View, edit, download, publish |
| Clients | `/clients` | List, create, edit clients |
| Trash | `/trash` | Soft-deleted invoices, 30-day recovery |
| Settings | `/settings` | Profile, Theme Customization, Business Logo |

---

## 6. Features

### 6.1 Authentication
- Email + password signup/login only
- JWT access token (15 min) + refresh token in HttpOnly cookie (7 days)
- Email verification on signup
- Forgot password / reset flow via email link

### 6.2 Dashboard
- Lists recent invoices created by the user
- Invoice status badges: **Draft**, **Published**, **Archived**
- Quick-access "Create Invoice" button
- Summary stats (total invoices, published count, pending)

### 6.3 Invoice Creation Flow

**Step 1 — Template Selection**
- User chooses from a set of pre-designed invoice templates
- Templates vary in layout and visual style

**Step 2 — Customization Panel**

| # | Feature | Detail |
|---|---|---|
| 1 | Invoice Font | Choose from 3–5 font options |
| 2 | Color Scheme | Preset palettes or custom hex input |
| 3 | Signature | Font-based (choose style) or draw via HTML Canvas |
| 4 | Amount | Line items with quantity, rate, subtotal |
| 5 | Currency | Supports all countries via ISO 4217 |
| 6 | Tax Percentage | Configurable tax rate applied on subtotal |
| 7 | Download | Export as PDF |
| 8 | Invoice Number | Auto-increments based on user's invoice history |
| 9 | Live Preview | Real-time side-by-side rendering of the invoice |
| 10 | Logo | Business logo upload (appears at top of invoice) |
| 11 | Discount | Optional percentage or flat discount on subtotal |

### 6.4 Invoice Status Lifecycle

```
Draft → Published → Archived
           ↓
         Trash (soft delete, 30-day recovery)
```

### 6.5 Client Management
- Create, edit, and delete client profiles
- Store client name, email, billing address, and tax ID
- Select client from dropdown during invoice creation to auto-fill details

### 6.6 Theme & Customization
- **Theme Modes:** Support for Light, Dark, and System (auto) modes
- **Brand Color:** Change the app's primary color via a color picker in Settings
- **Persistence:** User theme preferences are stored in the database and applied on login

### 6.7 Trash & Recovery
- Deleted invoices move to Trash
- Auto-purge after 30 days
- Users can restore within the 30-day window

---

## 7. Data Models

### User
```
_id, email, passwordHash, isVerified,
settings {
  themeMode: 'light' | 'dark' | 'system',
  primaryColor: string (hex),
  businessLogo: string (url)
},
createdAt, updatedAt
```

### Client
```
_id, userId (owner), name, email,
address { street, city, state, zip, country },
taxId, createdAt, updatedAt
```

### Invoice
```
_id, userId, clientDetails { name, email, address, taxId },
invoiceNumber (auto-increment),
status (draft | published | archived),
template, fontFamily, colorScheme,
lineItems [{ description, qty, rate, amount }],
subtotal, discountRate, discountAmount,
taxRate, taxAmount, total,
currency, signature { type: font|canvas, value },
isViewed (tracking),
isDeleted, deletedAt, createdAt, updatedAt
```

### InvoiceCounter
```
_id (userId), seq (incrementing integer per user)
```

---

## 8. API Endpoints

Base path for all endpoints: `/api/v1`

### Auth

| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register with email + password |
| POST | `/api/v1/auth/login` | Login, returns access token + sets cookie |
| POST | `/api/v1/auth/logout` | Clears refresh token cookie |
| POST | `/api/v1/auth/refresh` | Issues new access token |
| POST | `/api/v1/auth/forgot-password` | Sends reset email |
| POST | `/api/v1/auth/reset-password` | Resets password via token |
| GET | `/api/v1/auth/verify-email/:token` | Verifies email |

### Invoices

| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/invoices` | List user's invoices (paginated) |
| POST | `/api/v1/invoices` | Create new invoice |
| GET | `/api/v1/invoices/:id` | Get single invoice |
| PUT | `/api/v1/invoices/:id` | Update invoice |
| PATCH | `/api/v1/invoices/:id/status` | Change status |
| DELETE | `/api/v1/invoices/:id` | Soft delete → Trash |
| POST | `/api/v1/invoices/:id/restore` | Restore from Trash |
| GET | `/api/v1/invoices/:id/download` | Generate + return PDF |

### Templates

| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/templates` | List available invoice templates |

### Clients

| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/clients` | List user's clients |
| POST | `/api/v1/clients` | Create new client |
| GET | `/api/v1/clients/:id` | Get client details |
| PUT | `/api/v1/clients/:id` | Update client |
| DELETE | `/api/v1/clients/:id` | Delete client |

### Settings

| Method | Route | Description |
|---|---|---|
| PATCH | `/api/v1/settings` | Update user settings (theme, color, logo) |

### Standard API Response Contract (Mandatory)

All backend endpoints must follow one of these response shapes.

**Success**
```json
{
  "success": true,
  "data": {}
}
```

**Paginated success**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

**Error**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "fields": {}
  }
}
```

`error.fields` is returned only for validation errors.

### Error Code Catalog (Mandatory)

| HTTP | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body/query/params failed schema validation |
| 400 | `INVALID_REQUEST` | Request is syntactically valid but logically invalid |
| 401 | `UNAUTHORIZED` | Missing authentication |
| 401 | `TOKEN_EXPIRED` | Access token expired |
| 401 | `TOKEN_INVALID` | Access token invalid or tampered |
| 401 | `REFRESH_TOKEN_INVALID` | Refresh token missing, invalid, or revoked |
| 403 | `FORBIDDEN` | Authenticated user lacks required permission |
| 404 | `NOT_FOUND` | Resource not found or does not belong to the user |
| 409 | `CONFLICT` | Duplicate resource or uniqueness collision |
| 429 | `RATE_LIMIT_EXCEEDED` | Request rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

### Endpoint Documentation Standard (Mandatory)

Each endpoint must be documented with:
- Description and auth requirement
- Request headers/path/query/body schema
- Success and error examples (200/201 and common failures)
- Business rules and ownership/authorization behavior

---

## 9. Pricing

| Plan | Price | Limits |
|---|---|---|
| **Free Forever** | $0/mo | Up to N invoices/month (TBD), basic templates |
| **Pro** | $6/mo | Unlimited invoices, all templates, priority support |

---

## 10. Folder Structure

```
invoizemo/
├── frontend/                   # Next.js app
│   ├── app/
│   │   ├── (public)/           # Home, About, Pricing, Contact, Privacy
│   │   ├── (auth)/             # Login, Signup, Forgot Password
│   │   └── (app)/              # Dashboard, Invoice Create/Edit, Trash
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   ├── invoice/            # Template selector, Canvas signature, PDF preview
│   │   └── layout/             # Navbar, Sidebar, Footer
│   ├── lib/                    # API client, auth helpers, utils
│   └── styles/
│
├── backend/                    # Express API
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── invoices/
│       │   └── templates/
│       ├── middleware/         # requireAuth, validate, errorHandler
│       ├── config/             # env.ts, db.ts
│       └── utils/              # PDF generator, invoice counter, email
│
└── .env.example
```

---

## 11. Security Checklist

- [ ] Zod-validated env vars — crash on startup if misconfigured
- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are different and at least 64 chars
- [ ] JWT access in `Authorization: Bearer` header; refresh in `HttpOnly; Secure; SameSite=Strict` cookie
- [ ] Refresh tokens are hashed in DB, rotated on refresh, and reuse triggers session revocation
- [ ] Account lockout policy for repeated failed logins (example: 5 attempts in 15 minutes)
- [ ] `helmet` for security headers
- [ ] `cors` with explicit origin allowlist
- [ ] `express-rate-limit` globally and stricter limits on auth routes
- [ ] `express-mongo-sanitize` against NoSQL injection
- [ ] `express.json({ limit: '10kb' })` payload cap
- [ ] Zod request validation on all body/query/params routes
- [ ] Email verification before full account access
- [ ] Ownership helper/query policy on all `:id` resource routes (prevent IDOR)
- [ ] Soft delete only — no hard deletes in user flow
- [ ] All invoice queries scoped to `req.user._id` and `isDeleted` rules
- [ ] TTL index or scheduled purge for trashed invoices and auth ephemeral tokens
- [ ] Health endpoint `GET /health` and readiness endpoint `GET /ready` (DB-aware)
- [ ] Health/readiness excluded from strict rate limits if deployment platform polls frequently
- [ ] Structured logging with sensitive data redaction (tokens/passwords/PII)
- [ ] Error monitoring (Sentry or equivalent) configured with safe scrubbing
- [ ] PDF generation server-side only
- [ ] API version prefix `/api/v1` enforced
- [ ] `npm audit` — fix all high/critical before deploy

---

## 12. Backend Architecture Baseline (Implementation Contract)

Backend implementation must include:
- `src/config/env.ts` for env parsing/validation with Zod
- `src/config/db.ts` for MongoDB connection bootstrap
- `src/app.ts` for middleware chain and route mounting
- `src/server.ts` for startup sequence
- Feature modules under `src/modules/<module>` with model, schema, service, controller, routes

Required middleware order:
1. Security and request tooling (`helmet`, `cors`, parsers, sanitize)
2. Logging
3. Global rate limiter (`/api/v1`)
4. Auth-specific limiter (`/api/v1/auth`)
5. Health and readiness routes
6. API routes
7. Not-found handler
8. Central error handler

Critical backend behavior:
- Route inputs validated with Zod before controller logic
- Ownership checks enforced on all user-scoped resources by `_id` plus `userId`
- Standard response formatter used by all controllers
- Error classes map to the mandatory error code catalog
- Audit/security tooling included in CI before frontend integration

---

## 13. Out of Scope (v1)

- Google / social OAuth
- Multi-user teams / workspaces
- Recurring invoice scheduling
- Stripe payment collection
- Client portal (share invoice link for client view)
- Email delivery of invoice to client (v2)

---

## 14. Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | Max invoices on Free tier? | Product |
| 2 | How many templates in v1? | Design |
| 3 | PDF generation library — Puppeteer vs PDFKit vs react-pdf? | Engineering |
| 4 | Canvas signature — save as base64 in DB or object storage? | Engineering |
| 5 | Invoice number format — `INV-0001` or custom prefix? | Product |
