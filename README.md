# eCommerce Project

Front-end eCommerce application (React + Vite) using **mock REST APIs**. all data is fetched from public mock services (DummyJSON, etc.).

## Structure

| Directory  | Stack                          | Description                                                             |
| ---------- | ------------------------------ | ----------------------------------------------------------------------- |
| **portal** | React, Vite, MUI, REST (fetch) | Frontend: auth UI, routing, mock REST API layer, snackbar notifications |

## Prerequisites

- Node.js 18+
- npm

## Environment

### Portal (`portal/`)

Copy `portal/.env.example` to `portal/.env` if you need to override the mock API base URL (optional). By default, the app uses public mock APIs (e.g. DummyJSON).

```env
# Optional: override base URL for mock REST APIs
# VITE_API_BASE_URL=https://dummyjson.com
```

## Setup

```bash
cd portal && npm install
```

## Run

```bash
cd portal
npm run dev
```

App: `http://localhost:5173` (or the port Vite prints).

## Build

```bash
cd portal && npm run build
```

Preview production build: `cd portal && npm run preview`.

## Mock REST APIs

- **Auth (login):** [DummyJSON Auth](https://dummyjson.com/docs/auth) – e.g. `POST https://dummyjson.com/auth/login` (username/password). The portal maps email → username for demo.
- **Auth (sign up):** DummyJSON `POST /users/add`; the app then returns a mock token and user.
- **Forgot / reset password, verify email:** Simulated in the app with mock success responses (no real email).

All API calls go through `portal/src/services/api.ts` (GET/POST/PUT/DELETE as appropriate).

## Notifications

Snackbar (toast) notifications are shown for:

- Successful login / sign up / logout
- Successful forgot password, reset password, email verification
- API errors

Implemented via `NotificationContext` and MUI `Snackbar` (auto-hide, success/error styling).

## Portal routes

| Route                       | Page            |
| --------------------------- | --------------- |
| `/`                         | Home            |
| `/login`                    | Login           |
| `/signup`                   | Sign up         |
| `/forgot-password`          | Forgot password |
| `/reset-password?token=...` | Reset password  |
| `/verify-email?token=...`   | Verify email    |

## Tech summary

- **Portal:** React 19, Vite, TypeScript, MUI, REST (fetch), React Router, React Hook Form, Zod, Snackbar notifications. No GraphQL, Apollo, NestJS, or backend.
