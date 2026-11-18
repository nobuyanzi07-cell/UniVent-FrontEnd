# UniVent

UniVent helps students across Nairobi's universities discover and attend campus events, while clubs and offices can publish and manage them.

## Getting started

Install dependencies and start the local development server:

```sh
npm install
npm run dev
```

The app is built with React and Vite.

To create a production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Browse events |
| `/events/:id` | Event details |
| `/saved` | Saved events |
| `/create` | Create event preview |
| `/auth` | Login |
| `/auth?mode=signup` | Sign up |

## Create Event Preview

The `/create` page provides a frontend preview of the event creation experience.

Users can enter:

- Event name
- Category
- Description
- Date
- Time
- Venue
- City
- Price
- Event image URL

The page includes client-side validation and a live event preview that updates as information is entered.

The current Create Event implementation is a frontend preview only. It does not submit event data to a backend API.

## Project structure

```text
src/
  Components/       # Shared UI components
  Pages/            # Individual route page components
  components/       # Additional reusable components
  pages/            # Additional page components
  hooks/             # Custom React hooks
  routing/           # React Router route definitions
  services/         # API and event-related services
  test/              # Test setup
  App.jsx            # Main application component
  main.jsx           # React entry point
  styles.css        # Global styles

index.html           # Vite HTML entry
vite.config.js       # Vite configuration
package.json         # Project dependencies and scripts
```

## Event Preview Features

The Create Event preview supports:

- Required-field validation
- Validation error messages
- Live preview of event information
- Event category display
- Free or paid event display
- Date and time formatting
- Venue and city display
- Event description preview
- Image URL preview
- Reset functionality
- Responsive desktop and mobile layout
- Successful validation state

## Technology

- React
- Vite
- React Router
- CSS
- JavaScript

## Development

Start the development server with:

```sh
npm run dev
```

Then open the local URL provided by Vite in your browser.

Before committing changes, check the repository status:

```sh
git status
```

Build the application to check for production build errors:

```sh
npm run build
```

## Contribution

UniVent is developed collaboratively. Contributors should work on their assigned feature branches and submit pull requests for review before changes are merged into the main branch.
