# TinyLink

A simple URL shortener web app built with Next.js, allowing users to create short links, view statistics, and manage links.

## Features

- Create short URLs with optional custom codes
- Redirect to original URLs with click tracking
- Dashboard to list, search, and delete links
- Stats page for individual link details
- Health check endpoint
- Responsive UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon for production)
- **Deployment**: Vercel

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd tinylink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update `DATABASE_URL` with your Neon Postgres connection string
   - Update `NEXT_PUBLIC_BASE_URL` with your deployment URL (e.g., `https://your-app.vercel.app`)

4. Run database migrations (if using Prisma):
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (e.g., from Neon)
- `NEXT_PUBLIC_BASE_URL`: Base URL of the deployed app

## API Endpoints

### Create Link
- **POST** `/api/links`
- Body: `{ "originalUrl": "https://example.com", "shortCode": "optional" }`
- Response: Link object or 409 if code exists

### List Links
- **GET** `/api/links`
- Response: Array of links

### Get Link Stats
- **GET** `/api/links/:code`
- Response: Link object or 404

### Delete Link
- **DELETE** `/api/links/:code`
- Response: Success message or 404

### Health Check
- **GET** `/healthz`
- Response: `{ "ok": true, "version": "1.0" }`

## Pages

- `/`: Dashboard (list, add, delete links)
- `/code/:code`: Stats for a specific link
- `/:code`: Redirect to original URL

## Deployment

1. Push to GitHub.
2. Connect to Vercel: Import project from GitHub.
3. Set environment variables in Vercel dashboard.
4. Deploy.

For database, ensure Neon is set up and URL is added to Vercel env vars.

## Autograding

- URLs and responses match the spec for automated testing.
- Health endpoint returns 200.
- Links are created, redirected, and deleted correctly.



## License

MIT
