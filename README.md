# 🎟️ Event Ticketing System — Backend

A robust and scalable REST API for an **Event Ticketing System**, built with [NestJS](https://nestjs.com/) and [TypeScript](https://www.typescriptlang.org/). The API handles everything from user authentication and event management to order processing, ticket generation (with QR codes & PDFs), and email notifications.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Database Migrations](#-database-migrations)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Running Tests](#-running-tests)

---

## ✨ Features

- 🔐 **JWT Authentication** — Access token & refresh token strategy with role-based access control (RBAC)
- 🗓️ **Event Management** — Full CRUD for events and event categories
- 🛒 **Order Processing** — Create and manage ticket orders with auto-expiry via background queues
- 🎫 **Ticket Generation** — QR code & PDF ticket generation upon successful order
- 📧 **Email Notifications** — Transactional emails via SMTP with Handlebars templates
- 📊 **Dashboard** — Aggregated analytics and statistics
- 📝 **Activity Logging** — Automatic request/response activity logging via interceptors
- 📦 **File Storage** — Pluggable storage driver supporting local, MinIO, and GCS
- 📄 **Swagger UI** — Auto-generated interactive API documentation

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                        |
| ------------- | --------------------------------------------------------------------------------- |
| Framework     | [NestJS](https://nestjs.com/) v11                                                 |
| Language      | TypeScript v5                                                                     |
| Database      | PostgreSQL via [TypeORM](https://typeorm.io/)                                     |
| Cache / Queue | Redis via [BullMQ](https://docs.bullmq.io/)                                       |
| Mailer        | Nodemailer + [@nestjs-modules/mailer](https://github.com/nest-modules/mailer)     |
| Validation    | [Zod](https://zod.dev/) via [nestjs-zod](https://github.com/risenforces/nestjs-zod) |
| Auth          | Passport.js + JWT                                                                 |
| PDF Generation| [pdf-lib](https://pdf-lib.js.org/)                                                |
| QR Codes      | [qrcode](https://github.com/soldair/node-qrcode)                                  |
| API Docs      | [Swagger / OpenAPI](https://swagger.io/)                                          |
| Dev Tooling   | ESLint, Prettier, Jest                                                            |

---

## 🏗️ Architecture Overview

```
src/
├── modules/              # Business domain modules
│   ├── auth/             # Authentication (login, register, refresh, forgot password)
│   ├── user/             # User profile management
│   ├── events/           # Event CRUD
│   ├── event-categories/ # Event category management
│   ├── orders/           # Order creation & management
│   ├── tickets/          # Ticket issuance & QR/PDF generation
│   ├── dashboard/        # Analytics & statistics
│   └── log-activity/     # Activity log records
│
├── infrastructures/      # Cross-cutting infrastructure concerns
│   ├── databases/        # TypeORM config & migrations
│   ├── interceptors/     # Global response & log-activity interceptors
│   └── modules/
│       ├── jwt/          # JWT strategy, guards, and enums
│       ├── queue/        # BullMQ queue definitions & processors
│       ├── mail/         # Mailer service & Handlebars templates
│       └── storage/      # Storage driver abstraction (local / MinIO / GCS)
│
└── shared/               # Shared utilities, decorators, and helpers
```

---

## ✅ Prerequisites

Make sure the following are installed on your machine:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14
- **Docker & Docker Compose** (for Redis and Mailpit)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PutuRivan/backend-event-ticketing-system
cd backend-event-ticketing-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#-environment-variables) for a full description of each variable.

### 4. Start infrastructure services (Redis + Mailpit)

```bash
docker-compose up -d
```

This will spin up:
- **Redis** on port `6379` — used for the BullMQ job queue
- **Mailpit** on port `8025` (web UI) and `1025` (SMTP) — used to catch emails locally

### 5. Run database migrations

```bash
npm run migration:run
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Application environment | `development` |
| `APP_NAME` | Application name | `EventTicketing` |
| `APP_KEY` | Application secret key | `base64:randomkey` |
| `APP_PORT` | HTTP server port | `3000` |
| `APP_URL` | Public base URL | `http://localhost:3000` |
| `DB_HOST` | PostgreSQL host | `127.0.0.1` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_DATABASE` | Database name | `event_ticketing` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `secret` |
| `DB_POOL_SIZE` | Connection pool size | `10` |
| `JWT_SECRET` | Secret for access tokens | `your_jwt_secret` |
| `JWT_EXPIRES_IN_SECONDS` | Access token TTL (seconds) | `86400` |
| `JWT_REFRESH_TOKEN_SECRET` | Secret for refresh tokens | `your_refresh_secret` |
| `JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS` | Refresh token TTL | `604800` |
| `JWT_FORGOT_PASSWORD_SECRET` | Secret for password-reset tokens | `your_forgot_secret` |
| `JWT_FORGOT_PASSWORD_EXPIRES_IN_SECONDS` | Password-reset token TTL | `3600` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password (optional) | `` |
| `STORAGE_DRIVER` | Storage driver | `local` \| `minio` \| `gcs` |
| `STORAGE_ROOT_PATH` | Local storage root directory | `storage` |
| `STORAGE_FILE_MAX_SIZE_IN_BYTES` | Max upload size | `10485760` |
| `QUEUE_BACKOFF_DELAY_IN_SECONDS` | Retry backoff delay | `5` |
| `QUEUE_RETRY_ATTEMPTS` | Max job retry attempts | `3` |
| `QUEUE_EXPIRE_ORDER_IN_SECONDS` | Order auto-expiry timeout | `900` |

---

## ▶️ Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run build
npm run start:prod
```

---

## 🗃️ Database Migrations

TypeORM is used for all database schema management.

```bash
# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Create a new empty migration file
npm run migration:create -- src/infrastructures/databases/migrations/MigrationName

# Generate a migration from entity changes
npm run migration:generate -- src/infrastructures/databases/migrations/MigrationName
```

---

## 📖 API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/docs
```

The API uses **URI versioning**. All endpoints are prefixed with `/api/v1`.

### Authentication

Most endpoints require a **Bearer JWT token** in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Use the `/api/v1/auth/login` endpoint to obtain an access token and refresh token.

---

## 📁 Project Structure

```
.
├── src/
│   ├── app.module.ts          # Root application module
│   ├── config.ts              # Centralized app configuration
│   ├── main.ts                # Application entry point (bootstrap)
│   ├── modules/               # Feature modules
│   ├── infrastructures/       # Infrastructure & cross-cutting concerns
│   └── shared/                # Shared utilities and helpers
├── storage/                   # Local file storage (gitignored)
├── test/                      # E2E tests
├── docker-compose.yml         # Docker services (Redis, Mailpit)
├── .env.example               # Example environment configuration
├── nest-cli.json              # NestJS CLI configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start in watch/development mode |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start the compiled production build |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Run ESLint and auto-fix issues |
| `npm run format` | Run Prettier on source files |
| `npm run migration:run` | Apply pending database migrations |
| `npm run migration:revert` | Revert the last migration |
| `npm run migration:generate` | Generate a migration from entity diff |

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage report
npm run test:cov
```
