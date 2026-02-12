# eCommerce Project

Full-stack eCommerce application with a NestJS GraphQL API and a React (Vite) portal.

## Structure

| Directory | Stack | Description |
|-----------|--------|--------------|
| **api** | NestJS, TypeORM, GraphQL, PostgreSQL | Backend: auth, database, GraphQL API |
| **portal** | React, Vite, MUI, Apollo Client | Frontend: auth UI, routing, GraphQL client |

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm

## Environment

### API (`api/`)

Copy `api/.env.example` to `api/.env` and set:

```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ecommerce-project-cursor
JWT_SECRET=your-secret
```

Optional: `FRONTEND_VERIFY_URL`, `MAIL_*` for verification emails.

### Portal (`portal/`)

Copy `portal/.env.example` to `portal/.env` and set:

```env
VITE_GRAPHQL_URI=http://localhost:3000/graphql
```

## Setup

```bash
# API
cd api && npm install

# Portal
cd portal && npm install
```

Create the database (e.g. `ecommerce-project-cursor`) in PostgreSQL before running the API.

## Run

**Terminal 1 – API**

```bash
cd api
npm run start:dev
```

GraphQL: `http://localhost:3000/graphql`

**Terminal 2 – Portal**

```bash
cd portal
npm run dev
```

App: `http://localhost:5173` (or the port Vite prints).

## Database seeding

From the `api` folder:

```bash
npm run seed
```

This builds the API and runs all seeders (e.g. test users). Re-running is safe; existing data is skipped.

- **Seed all:** `npm run seeds` (run after `npm run build` if needed)
- **Seed one:** `npm run seed:specific -- UserSeeder`

## Build

```bash
# API
cd api && npm run build

# Portal
cd portal && npm run build
```

Production API: `cd api && npm run start:prod` (run after build).

## Auth (API)

GraphQL mutations:

- `signUp`, `login`, `forgotPassword`, `resetPassword`, `verifyEmail`
- Query: `health`

JWT is returned on login; send as `Authorization: Bearer <token>` for protected operations.

## Portal routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/login` | Login |
| `/signup` | Sign up |
| `/forgot-password` | Forgot password |
| `/reset-password?token=...` | Reset password |
| `/verify-email?token=...` | Verify email |

## Tech summary

- **API:** NestJS, TypeORM, PostgreSQL, GraphQL (Apollo), JWT, Passport, bcrypt, typeorm-extension (seeding)
- **Portal:** React 19, Vite, TypeScript, MUI, Apollo Client, React Router, React Hook Form, Zod
