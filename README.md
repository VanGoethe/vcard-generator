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

## Run locally

The dev server uses Next.js’s default port **3000**. You should end up at [http://localhost:3000](http://localhost:3000).

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd visit-card-generator
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env-example .env
   ```

   Edit `.env` and set at least:

   | Variable | Local development |
   | -------- | ------------------- |
   | `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://USER:PASSWORD@127.0.0.1:5432/DATABASE_NAME` (on macOS, prefer `127.0.0.1` over `localhost` if you see connection issues) |
   | `NEXT_PUBLIC_DEVELOPMENT_URL` | `http://localhost:3000` |
   | `NEXT_PUBLIC_MSAL_CLIENT_ID` | From your Azure app registration |
   | `NEXT_PUBLIC_MSAL_TENANT_ID` | From your Azure app registration |

   `NEXT_PUBLIC_PRODUCTION_URL` is mainly for production builds; you can keep the example value or set your real production URL.

   If you use `.env.local`, Next.js overrides `.env` for overlapping keys—keep `DATABASE_URL` (and MSAL IDs if split) in sync.

3. **PostgreSQL**

   Start PostgreSQL and create an empty database for this app (`createdb`, `psql`, or your GUI). Put host, port, database name, user, and password into `DATABASE_URL`.

4. **Apply migrations**

   Prisma uses **PostgreSQL** only (`prisma/migrations/migration_lock.toml`). The baseline migration **`20260330120000_init_postgresql`** creates the `users` schema (see `prisma/schema.prisma`). With `DATABASE_URL` set:

   ```bash
   npx prisma migrate dev
   ```

   This applies migrations and regenerates the Prisma Client. If you ever need the client without running migrations (e.g. after pulling schema changes), use `npx prisma generate`.

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

6. **Sign in from localhost**

   Microsoft login only works if **Azure** lists **`http://localhost:3000`** as a redirect URI on the **Single-page application** platform (not “Web”). Configure that in the portal—see **[docs/azure-spa-redirect.md](docs/azure-spa-redirect.md)** and the section below.

### Production database migrations

For servers or CI, point `DATABASE_URL` at the target database and run:

```bash
npx prisma migrate deploy
```

If you still have an older **MySQL** or **SQLite** database from a previous version of this fork, use a **new PostgreSQL** database and move data manually; migration history here is PostgreSQL-only.

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
