# UniVent

UniVent helps students across Nairobi's universities discover and attend campus
events, while clubs and offices can publish and manage them.

## Getting started

Install dependencies and start the local development server:

```sh
npm install
npm run dev
```

The app is built with React and Vite. Run `npm run build` to create a production
build, or `npm run preview` to serve that build locally.

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
  Pages/        # Individual route page components
  routing/      # React Router route definitions
  App.jsx       # Shared application layout
  main.jsx      # React entry point
  styles.css    # Global styles
index.html      # Vite HTML entry
vite.config.js  # Vite configuration
```
