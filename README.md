# Cloudora / Laggy Clouds

Cloudora, also known as Laggy Clouds, is a premium weather dashboard built for clear weather insight, smooth motion, and a polished glassmorphism interface. It combines live weather data, location-aware imagery, air quality insight, forecasts, maps, saved cities, travel planning, and a lightweight notification system.

The app is designed around a black, white, and blue atmospheric style with dynamic cloud backgrounds, responsive layouts, and simple user-friendly wording.

## Features

- Live weather dashboard for searched or detected locations.
- Dynamic hero images powered by Unsplash so different locations can show different scenery.
- Current weather, temperature, humidity, wind, sunrise, sunset, perceived temperature, and condition status.
- Hourly and weekly forecast views.
- Air quality panel with AQI-focused weather insight.
- Saved city support for quick city tracking.
- Interactive weather map area.
- Travel planner with weather-aware trip cards and insights.
- Analytics page with weather summaries and charts.
- Profile and settings pages for personalization.
- Premium notification center with unread badge, toast popups, clear all, remove, read/unread, categories, and localStorage persistence.
- Calm notification behavior: only the latest 2 notifications are kept, only 2 popups show at once, and popups auto-hide after 2 seconds.
- Dynamic moving cloud background with light and dark mode support.
- Responsive UI for desktop, tablet, and mobile screens.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion / Motion
- Recharts
- React Router
- React Leaflet / Leaflet
- Lucide React icons
- OpenWeather API
- Unsplash API

## Project Structure

```text
src/
  components/
    analytics/        Weather analytics cards and charts
    layout/           App shell, sidebar, header, dashboard, background
    maps/             Weather map UI
    notifications/    Notification center, cards, and toast UI
    travel/           Travel planner cards, forms, and insights
    weather/          Hero, forecast, and air quality sections
  context/            Weather, user, settings, and notification state
  hooks/              Shared React hooks
  lib/                Utility helpers
  pages/              Main route pages
  services/           Weather and Unsplash API logic
  types/              TypeScript domain types
  utils/              Weather and translation helpers
```

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- OpenWeather API key
- Unsplash API key

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. You can copy `.env.example`, then replace the values with your own API keys.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_UNSPLASH_API=your_unsplash_access_key
GEMINI_API_KEY=your_optional_gemini_api_key
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_OPENWEATHER_API_KEY` | Yes | Weather, forecast, and AQI data |
| `VITE_UNSPLASH_API` | Yes | Location-based dashboard images |
| `GEMINI_API_KEY` | Optional | Future AI-powered features |

Keep real API keys out of public commits.

### Run Locally

```bash
npm run dev
```

The development server runs on:

```text
http://localhost:3000
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run lint
```

This project uses `tsc --noEmit` for the lint script.

## App Pages

- Dashboard: Main weather view with hero image, live condition, metrics, forecasts, and air quality.
- Analytics: Weather summaries and chart-based insight.
- Maps: Weather map and radar-style UI.
- Saved Cities: Favorite city management.
- Travel Planner: Weather-aware travel planning.
- Profile: User profile and preferences.
- Settings: Theme, units, language, alert settings, and notification controls.

## Notification System

Cloudora includes a small premium notification system built with React context and localStorage.

Current behavior:

- Notification bell in the header.
- Animated unread badge.
- Dropdown notification center.
- Toast popups.
- Mark read/unread.
- Remove single notification.
- Clear all notifications.
- Notification categories.
- Sound toggle support.
- localStorage persistence.
- Maximum 2 notifications kept.
- Maximum 2 toast popups shown at once.
- Toast popups disappear automatically after 2 seconds.
- Cooldown is used to avoid frequent notification spam.

## Dynamic Background

The layout includes animated background clouds and atmospheric motion. The clouds are tuned for both light and dark mode and stay behind the main interface.

Related file:

```text
src/components/layout/LivelyBackground.tsx
```

## API Notes

OpenWeather is used for weather, forecast, and AQI data.

Unsplash is used for location-based dashboard hero images. If images do not change by location, check that `VITE_UNSPLASH_API` is set correctly and restart the dev server.

## Deployment

Cloudora can be deployed to platforms such as Vercel, Netlify, or any static hosting provider that supports Vite builds.

Typical deployment steps:

1. Push the project to GitHub.
2. Import it into the hosting provider.
3. Add the environment variables listed above.
4. Run the build command:

```bash
npm run build
```

5. Publish the `dist` output.

## Troubleshooting

If weather data does not load:

- Check `VITE_OPENWEATHER_API_KEY`.
- Restart the dev server after changing `.env`.
- Make sure the API key is active.

If location images do not load:

- Check `VITE_UNSPLASH_API`.
- Make sure the Unsplash key has access to the API.
- Try searching a different city.

If notifications feel too quiet:

- The app intentionally keeps only 2 notifications and uses a cooldown to avoid spam.
- Check notification settings in the Settings page.

If port 3000 is busy:

- Stop the other process or let Vite choose another available port.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run TypeScript checks |

## License

MIT License You are free to use, modify, and distribute this project.
