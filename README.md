# Como Pet Care — Next.js Production Starter Template

A production-grade, highly secure, and performance-optimized Next.js template utilizing the App Router, TypeScript (strict mode), Prisma ORM (MySQL), and Nodemailer.

This starter boilerplate is structured to deploy smoothly on resource-restricted shared Node.js hosting environments (such as Hostinger Node.js Web Apps), stand-alone VPS setups (via PM2), or containerized platforms (via Docker).

---

## Features Matrix

- **Runtime Environment:** Next.js (latest stable, App Router) and TypeScript (Strict Mode).
- **Styling:** Premium vanilla CSS design system with automatic Dark/Light mode styling, custom grids, forms, alerts, and micro-animations. No TailwindCSS bloat.
- **ORM & Database:** Prisma configured for MySQL with a singleton pattern client that prevents connection leaks, auto-migration on start, and automatic graceful disconnection on `SIGTERM`/`SIGINT`.
- **Environment Validation:** Strict Zod-based configuration schema parser (`src/lib/env.ts`) that validates environment variables on startup and fails loudly if values are incorrect or missing.
- **Mailer:** Reusable SMTP mailer wrapper (`src/lib/mail.ts`) utilizing Nodemailer with standard HTML responsive transactional layouts. Includes startup health verification checks.
- **Rate Limiting:** Built-in in-memory sliding-window rate limiter (`src/lib/rate-limit.ts`) for public API routes to mitigate botting, contact-form spam, and brute forcing.
- **Leveled Logging:** Centralized wrapper class (`src/lib/logger.ts`) providing timestamps and prefixing.
- **Security Headers:** Pre-configured CORS policies and strict HTTP Headers (CSP, HSTS, XSS-Protection, Frame-Options, Content-Type-Options) in `next.config.ts`.

---

## First-Time Local Setup

To spin up this repository in your local environment, run these steps sequentially:

1. **Clone & Navigate**

   ```bash
   git clone <your-repository-url>
   cd como-pet-care
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Duplicate the example file and modify the values with your local credentials:

   ```bash
   cp .env.example .env
   ```

4. **Initialize Database Schema & Migrations**
   Synchronize your database with the Prisma schema:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed Starter Data**
   Inject the default admin user and initial system log entries:

   ```bash
   npx prisma db seed
   ```

6. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Database Connection Management

Budget and shared hosting plans (like Hostinger) place **strict caps** on concurrent MySQL database connections. Prisma's default connection pooling rules can easily exhaust these limits, crashing the site.

To prevent this:

1. Use a single shared Prisma Client singleton instance (defined in `src/lib/prisma.ts`).
2. Always append query parameters to your `DATABASE_URL` in `.env` to restrict the connection limit and adjust timeout margins:
   ```text
   DATABASE_URL="mysql://username:password@localhost:3306/como_pet_care?connection_limit=5&pool_timeout=10"
   ```
   - `connection_limit=5`: Restricts this server process to a maximum of 5 simultaneous database connections.
   - `pool_timeout=10`: Instructs Prisma to wait a maximum of 10 seconds to get a connection from the pool before throwing a timeout error, keeping processes from stalling indefinitely.

---

## Reusable Mailer & System Health Checks

All outgoing emails are handled by Nodemailer inside `src/lib/mail.ts`. It reads configuration parameters from validated env variables.

### Uptime Health Route

The project exposes a `/api/health` endpoint. This route validates system health in real-time:

1. Queries the database with `SELECT 1` to verify MySQL availability.
2. Invokes transporter validation checks to verify SMTP mail credentials.
   This is perfect for uptime monitors (like UptimeRobot or BetterStack) to ensure bad configs fail loudly.

---

## Deployment Architectures

This repository is optimized to build and start seamlessly under three distinct environments:

### 1. Deploying to Hostinger (Node.js Web Apps Panel)

Hostinger provides a Git-integrated "Node.js Web Apps" manager. Use these steps to deploy:

1. **Upload Code:** Connect your GitHub repository to the Node.js App tab inside hPanel. Set the branch to `main`.
2. **Environment Variables:** Define all keys listed in `.env.example` directly in Hostinger's Environment Variables panel.
3. **Application Executable:** Hostinger injects the port using the `PORT` environment variable. The app automatically binds to `process.env.PORT` or falls back to `3000`.
4. **Build Phase:** Set your build command or package.json scripts. Hostinger automatically builds the standalone output. If building manually on the server:
   ```bash
   npm run build
   ```
5. **Start Script:** Hostinger launches the server using the package.json `start` command. Our start command runs:
   ```bash
   prisma migrate deploy && next start
   ```
   This ensures migrations are safely executed and applied on every git push without interactive developer prompts.
6. **Logs:** Monitor logs in the hPanel file manager or terminal logs output to troubleshoot startup validation errors.

---

## 2. Standalone VPS Deployment (PM2 + Nginx)

If you are deploying to a VPS (Ubuntu, Debian, etc.), you can run the app in cluster mode using PM2:

1. **Build the Standalone App:**
   ```bash
   npm run build
   ```
   This generates an optimized node bundle at `.next/standalone/`.
2. **Start PM2 Instance:**
   ```bash
   pm2 start ecosystem.config.js
   ```
3. **Configure Nginx:** Set up a reverse proxy in `/etc/nginx/sites-available/default` pointing to the application port (default `3000`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 3. Containerized Deployment (Docker)

To deploy the application inside container nodes:

1. **Build the Docker Image:**
   ```bash
   docker build -t como-pet-care .
   ```
2. **Launch the Container:**
   ```bash
   docker run -p 3000:3000 --env-file .env como-pet-care
   ```

---

## Project Structure Overview

```text
├── prisma/
│   ├── schema.prisma      # MySQL schemas (User, SystemLog models)
│   ├── seed.ts            # Admin user and audit log seed script
│   └── migrations/        # Safe SQL migration directories
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   │   └── route.ts       # Service health checks endpoint
│   │   │   └── send-test-email/
│   │   │       └── route.ts       # Zod-validated, rate-limited mail sender
│   │   ├── globals.css    # Premium CSS Variable design theme
│   │   ├── layout.tsx     # Next.js App Shell
│   │   └── page.tsx       # Live status dashboard UI
│   └── lib/
│       ├── env.ts         # Zod-based Environment validation schema
│       ├── logger.ts      # Custom leveled logger wrapper
│       ├── mail.ts        # Reusable SMTP mailer & templates
│       ├── prisma.ts      # Safe Singleton DB Client + Graceful Shutdown
│       └── rate-limit.ts  # In-memory sliding-window IP rate limiter
├── Dockerfile             # Multi-stage lean Docker config
├── ecosystem.config.js    # Cluster-mode PM2 configuration file
├── next.config.ts         # Standalone build settings and Security Headers
└── tsconfig.json          # Strict TypeScript compiler options
```
