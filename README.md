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
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
