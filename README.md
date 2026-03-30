# IMMAP e-card generator

## About

Web app for **iMMap** staff to create digital business cards: profile and contacts, a customizable card layout, QR codes that open a public contact page, and download options (image/PDF). Sign-in uses **Microsoft Entra ID (Azure AD)** via MSAL so organization accounts can access the tool securely. The public card view and editor include a dedicated **404** page and updated layout and styling for a consistent experience.

This repository is a **fork** of the open-source project by Bruno Luz:

**Original project:** [github.com/brunosllz/visit-card-generator](https://github.com/brunosllz/visit-card-generator)

Thank you to the original author for the foundation this build extends.

## Features

- Register personal description and contacts
- Customize the visit card appearance
- Generate the visit card and download it
- Public contact page reachable from the QR code
- Custom **404** page for unknown routes; refreshed visit card layout and global styles

## Technologies

Core stack: **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL**, **Tailwind CSS**. Forms use **React Hook Form** and **Zod**. QR codes, **html2canvas**, **jsPDF**, **Vitest** for tests. See `package.json` for full dependency versions.

## Prerequisites

- Node.js (LTS recommended)
- PostgreSQL (local install, or a managed/hosted instance you can reach over the network)
- Git

This project does **not** use Docker: there is no `docker-compose` in the repository, and you do not need Docker to run the app or the database.

## Getting started

1. **Clone this repository** (use your fork’s URL or the remote you use for this project).

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy the example file and adjust values:

   ```bash
   cp .env-example .env
   ```

   Typical local settings:

   - `NEXT_PUBLIC_DEVELOPMENT_URL` — e.g. `http://localhost:3000`
   - `NEXT_PUBLIC_PRODUCTION_URL` — production base URL (e.g. `https://ecard.immap.org` in `.env-example`)
   - `DATABASE_URL` — Prisma connection string for your PostgreSQL database, e.g. `postgresql://USER:PASSWORD@127.0.0.1:5432/DATABASE_NAME` (prefer `127.0.0.1` over `localhost` for TCP on macOS if you hit connection quirks)
   - MSAL: `NEXT_PUBLIC_MSAL_CLIENT_ID`, `NEXT_PUBLIC_MSAL_TENANT_ID` — from your Azure app registration

   If you use `.env.local`, Next.js overrides `.env`; keep `DATABASE_URL` consistent across both if you split config.

4. **PostgreSQL**

   Start your PostgreSQL server and ensure a database exists for this app (create one with `createdb`, `psql`, or your GUI). Put the same database name, user, password, host, and port into `DATABASE_URL`.

5. **Database and migrations**

   Prisma targets **PostgreSQL** only (see `prisma/migrations/migration_lock.toml`). The consolidated baseline migration **`20260330120000_init_postgresql`** applies the current schema (the `users` table and indexes—see `prisma/schema.prisma`).

   - **Local development:** after PostgreSQL is running and `DATABASE_URL` is set:

     ```bash
     npx prisma migrate dev
     ```

   - **Production or CI:** point `DATABASE_URL` at the target database, then:

     ```bash
     npx prisma migrate deploy
     ```

   If you still have an older **MySQL** or **SQLite** database from a previous version of this fork, use a **new PostgreSQL** database for this codebase and migrate or export/import data as needed; the migration history here is PostgreSQL-only.

6. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Microsoft Entra ID (Azure AD) — MSAL login

Sign-in uses MSAL in the browser. In the Azure Portal, the app registration’s **redirect URIs must be under the “Single-page application”** platform, not “Web”. Registering only as Web can cause **AADSTS9002326** when exchanging the authorization code for tokens.

See **[docs/azure-spa-redirect.md](docs/azure-spa-redirect.md)** for portal steps.

## Testing

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage
npm run test:ui       # Vitest UI
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run start`   | Production server        |
| `npm run lint`    | Lint (with fix)          |

## Development tools

ESLint, Prisma Studio (`npx prisma studio`), Vitest, Testing Library.

## Contributing

1. Fork the repository (or work from this team’s fork).
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit and push, then open a pull request.

## License

This project is licensed under the MIT License.
