# Invoicemo API Documentation

This document serves as the comprehensive "contract" and hand-off guide for developers consuming the Invoicemo backend API.

## 1. Getting Started & Architecture

### Base URLs
- **Local Development:** `http://localhost:5001/api/v1`
- **System Endpoints:** `http://localhost:5001/`

### Global Response Wrapper
Every successful request and error response follows a strict, predictable JSON wrapper. You never have to guess whether the root object is an array or an object.

**Success Shape:**
```json
{
  "success": true,
  "data": { ... } // or array [...]
}
```

**Error Shape:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable reason",
    "fields": { "optional_field": ["validation error"] }
  }
}
```

### Quickstart Verification
The API includes basic system verification endpoints to ensure uptime:
- **Liveness:** `GET /health` -> `{"success": true, "data": {"status": "ok"}}`
- **Readiness:** `GET /ready` -> Checks MongoDB connection. Returns 503 if disconnected.

---

## 2. Authentication & Security Flow

The API uses an **Access Token + Refresh Token** strategy.

### Tokens
1. **Access Token (JWT):** Short-lived (15 mins). Must be sent in the `Authorization` header for all protected routes:
   `Authorization: Bearer <token>`
2. **Refresh Token:** Long-lived (7 days). Stored securely by the backend in an `HttpOnly; Secure; SameSite=Strict` cookie. It cannot be accessed via JavaScript. 

### Limits
- **Global Rate Limiting:** 100 requests per minute per IP.
- **Auth Rate Limiting:** 10 requests per minute per IP on `/auth/*` (prevents brute force).

---

## 3. Standard HTTP Status & Error Codes

You can confidently switch on HTTP status codes or the `error.code` string on the frontend.

| HTTP Code | Error Code Context | Description / Troubleshooting |
| :--- | :--- | :--- |
| **200** | `OK` | Standard success for GET, PUT, PATCH, DELETE. |
| **201** | `Created` | Standard success for POST (resource successfully created). |
| **400** | `VALIDATION_ERROR` | Bad request. Check the `error.fields` object for specific schema failures (e.g. invalid email, missing required string). |
| **401** | `UNAUTHORIZED` | Missing or invalid Access Token. |
| **401** | `TOKEN_EXPIRED` | Access Token has naturally expired. Frontend should intercept this and transparently call `POST /auth/refresh` to get a new token. |
| **403** | `FORBIDDEN` | Authenticated, but lacking permissions for the specific resource. |
| **404** | `NOT_FOUND` | Resource does not exist, **or** the resource does not belong to the authenticated user. For security, we never return 403 for cross-user data; we always return 404 to obscure existence. |
| **409** | `CONFLICT` | A unique constraint failed (e.g., trying to register an email that already exists). |
| **429** | `RATE_LIMIT_EXCEEDED` | Too many requests in the given window. |

---

## 4. Endpoint Reference & Scenarios

### Authentication (`/api/v1/auth`)

#### `POST /register`
- **Body:** `{ "email": "test@example.com", "password": "Password123!" }`
- **Scenario: Success** (201 Created) -> User created, sets Refresh cookie, returns `{ accessToken, user }`.
- **Scenario: Conflict** (409 Conflict) -> Email already exists.

#### `POST /login`
- **Body:** `{ "email": "test@example.com", "password": "Password123!" }`
- **Scenario: Success** (200 OK) -> Sets Refresh cookie, returns `{ accessToken, user }`.
- **Scenario: Failed** (400 / 401) -> Invalid credentials.

#### `POST /refresh`
- **Description:** Rotates the access token using the HttpOnly cookie.
- **Scenario: Success** (200 OK) -> Returns new `{ accessToken }`.

#### `POST /logout`
- **Scenario:** (200 OK) Clears the HttpOnly refresh token cookie.

---

### Invoices (`/api/v1/invoices`)

All endpoints require `Authorization: Bearer <token>`.

#### `POST /` (Create Scenario)
- **Body:** Requires `template`, `fontFamily`, `colorScheme`, `lineItems`, `subtotal`, `taxRate`, `taxAmount`, `total`, `currency`. Optional: `signature`.
- **Responses:**
  - `201 Created`: Invoice saved. Returns full invoice object.
  - `400 Bad Request`: `VALIDATION_ERROR` (e.g., missing fields, negative amounts).

#### `GET /`
- **Description:** Retrieves user's invoices.
- **Query Params:** `?page=1&limit=20&status=draft`
- **Responses:** `200 OK`

#### `GET /:id`
- **Responses:** `200 OK` (if found & owned), `404 Not Found` (if missing or owned by someone else).

#### `PUT /:id` (Change Scenario - Full Update)
- **Description:** Fully updates an existing invoice.
- **Body:** Partial or full invoice schema.
- **Responses:** `200 OK`, `404 Not Found`.

#### `PATCH /:id/status` (Change Scenario - Status Update)
- **Description:** Specialized endpoint to progress invoice state.
- **Body:** `{ "status": "published" }` (enum: `draft`, `published`, `archived`)
- **Responses:** `200 OK`, `400 Bad Request` (invalid status).

#### `DELETE /:id` (Discard Scenario - Soft Delete)
- **Description:** We implement a **Soft Delete** pattern. The invoice is not permanently destroyed immediately. It sets `isDeleted: true` and `deletedAt: current_date`. 
- **DB Behavior:** A MongoDB TTL (Time To Live) index automatically hard-deletes the record exactly 30 days after `deletedAt` is set.
- **Responses:** `200 OK`, `404 Not Found`.

#### `POST /:id/restore` (Restore Scenario)
- **Description:** Rescues an invoice from the "discarded/soft-deleted" state.
- **Action:** Sets `isDeleted: false` and `deletedAt: null`.
- **Responses:** `200 OK`.

#### `GET /:id/download` (Download Scenario)
- **Description:** Retrieves the invoice data prepared for PDF generation or direct download formatting.
- **Responses:** `200 OK`.

---

### Templates (`/api/v1/templates`)

#### `GET /`
- **Description:** Retrieves available system templates for invoices.
- **Auth:** Requires Bearer token.
- **Responses:** `200 OK` -> Returns array of template objects.
