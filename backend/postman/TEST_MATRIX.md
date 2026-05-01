# Invoizemo Backend Test Matrix

Base URL: `http://localhost:5000/api/v1`

## Auth
- `POST /auth/register`: 201, 400, 409
- `POST /auth/login`: 200, 400, 401, 403, 429
- `POST /auth/refresh`: 200, 401
- `POST /auth/logout`: 200
- `POST /auth/forgot-password`: 200, 400
- `POST /auth/reset-password`: 200, 400
- `GET /auth/verify-email/:token`: 200, 400

## Invoices
- `GET /invoices`: 200, 401
- `POST /invoices`: 201, 400, 401
- `GET /invoices/:id`: 200, 401, 404
- `PUT /invoices/:id`: 200, 400, 401, 404
- `PATCH /invoices/:id/status`: 200, 400, 401, 404
- `DELETE /invoices/:id`: 200, 401, 404
- `POST /invoices/:id/restore`: 200, 401, 404
- `GET /invoices/:id/download`: 200, 401, 404

## Templates
- `GET /templates`: 200, 401
