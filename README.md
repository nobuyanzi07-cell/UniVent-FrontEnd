# UniVent

UniVent helps students across Nairobi's universities discover and attend campus events, while clubs and offices can publish and manage them.

## Getting started

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

The app is built with React and Vite. Run `npm run build` to create a production build, or `npm run preview` to serve that build locally.

Other scripts:

```bash
npm run lint   # ESLint
npm test       # Vitest
```

## Environment

Events come from mock data by default. To use the Ticketmaster API, copy `.env.example` to `.env` and set `VITE_TM_API_KEY`. Never commit `.env`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Browse |
| `/events/:id` | Event details |
| `/saved` | Saved events |
| `/create` | Create event preview |
| `/auth` | Login |
| `/auth?mode=signup` | Sign up |

## Project structure

```text
src/
  Components/       # Shared UI components
  Pages/            # Route page components
  context/          # Saved events provider
  hooks/            # Custom React hooks
  routing/          # React Router route definitions
  services/         # API and mock event data
  test/             # Test setup
  App.jsx           # Shared layout (NavBar, routes, footer)
  main.jsx          # React entry point
  styles.css        # Global styles

index.html          # Vite HTML entry
vite.config.js      # Vite configuration
vercel.json         # SPA rewrites for deployment
package.json        # Dependencies and scripts
```

## Deployment

The site is deployed on Vercel. `vercel.json` rewrites all routes to `index.html` so deep links like `/saved` work on refresh.