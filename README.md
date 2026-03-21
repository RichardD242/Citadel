<p align="center">
  <img src="logos/citadel-white-hzlgo-removebg-preview.png" alt="Citadel Logo" width="320" />
</p>

<h1 align="center">CITADEL</h1>

<p align="center">
  Clean. Focused. Relentless.
</p>

<p align="center">
  A black-and-white gym fitness company, coming soon.
</p>

## About

Citadel is a coming-soon landing page for a premium fitness brand built around clarity, discipline, and high performance.

The site presents:
- A bold black-and-white identity
- A cinematic animated hero background
- A focused waitlist call-to-action

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase

## Getting Started

1. Install dependencies:

   npm install

2. Start waitlist API server:

  npm run dev:server

3. Start frontend dev server:

   npm run dev

4. Build for production:

   npm run build

## Environment Variables

Create a `.env` file in project root:

- `ADMIN_PASSWORD`: password for `/admin`
- `ADMIN_TOKEN_SECRET`: long random secret for signing admin tokens
- `SUPABASE_URL`: your Supabase project URL
- `SUPABASE_SECRET_KEY`: your Supabase secret/service role key (server-side only)
- `SUPABASE_WAITLIST_TABLE`: table name, defaults to `waitlist_signups`

## Deploy On Vercel

1. Import your GitHub repo in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables in Vercel Project Settings:
  - `ADMIN_PASSWORD`
  - `ADMIN_TOKEN_SECRET`
  - `SUPABASE_URL`
  - `SUPABASE_SECRET_KEY`
  - `SUPABASE_WAITLIST_TABLE`

The project includes serverless functions in `/api` for waitlist and admin endpoints, so `/admin` and signup work in production on Vercel.

## Admin Access

- Admin page: /admin
- Password is controlled by ADMIN_PASSWORD in your .env file
- Copy .env.example to .env and set a strong password before using in production

The admin page lists all waitlist signups saved by the API.

## Status

Citadel is currently in pre-launch.

Join the waitlist to be first in.
