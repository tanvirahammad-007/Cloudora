# Aether — Premium Weather Intelligence Dashboard

Aether is a professional-grade weather intelligence dashboard designed with a focus on high-fidelity glassmorphism aesthetics and real-time atmospheric data. Built for performance and precision, it provides deep insights into global weather patterns, air quality, and geographic context.

![Dashboard Preview](https://images.unsplash.com/photo-1592210633464-a7db05248a11?auto=format&fit=crop&q=80&w=2000&h=800)

## 🌟 Features

- **Real-time Global Search**: Instant weather data for any city worldwide.
- **Micro-Atmospheric Metrics**: Track humidity, wind speed, UV levels (where applicable), and pressure.
- **Hourly Trends Chart**: Visualize temperature fluctuations over the next 24 hours with interactive D3-powered visualizations.
- **Weekly Cycles**: A comprehensive 5-day forecast with dynamic iconography.
- **Air Quality Intelligence**: Deep dive into PM2.5, PM10, NOx, and general AQI safety levels.
- **Geographic Context**: Dynamic data fetching for countries, including flags, currency, and population metrics.
- **Adaptive Glassmorphism UI**: A fluid interface that looks stunning in both light and dark modes.
- **Premium Performance**: Optimized with Framer Motion for smooth 60fps transitions and tailored CSS for minimal paint times.

## 🛠 Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Data Visualization**: Recharts (powered by D3)
- **Icons**: Lucide React
- **APIs**: 
  - [OpenWeatherMap API](https://openweathermap.org/api) (Core Weather & AQI)
  - [REST Countries API](https://restcountries.com/) (Geographic Intelligence)

## 📂 Folder Structure

```text
src/
├── components/
│   ├── layout/         # Core structure (Sidebar, Dashboard, RightPanel)
│   ├── ui/             # Reusable atomic units (ThemeToggle)
│   └── weather/        # Domain-specific modules (WeatherHero, AirQuality, etc.)
├── context/            # Global State Management (Weather & Theme context)
├── services/           # API integration logic
├── lib/                # Shared utilities and helpers
├── index.css           # Global styles and Tailwind utility definitions
└── App.tsx             # Main application entry point
```

## 🚀 Performance Optimization

- **Selective Rerenders**: Optimized React Context usage to prevent unnecessary component updates during data fetches.
- **Asset Optimization**: Using CDN-delivered SVG icons and lightweight weather assets.
- **Memoized Calculations**: Extensive use of `useMemo` for processing complex API payloads.
- **GPU Acceleration**: Hardware-accelerated animations using Framer Motion's `layout` and `motion` attributes.
- **Smooth Layout Transitions**: Staggered children animations for a perceived decrease in loading times.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- An [OpenWeatherMap API Key](https://openweathermap.org/api)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aether-weather.git
   cd aether-weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file (or rename `.env.example`) and add your credentials:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment to Vercel

Aether is optimized for one-click deployment on Vercel:

1. Push your code to a GitHub repository.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. In the **Environment Variables** section, add `VITE_OPENWEATHER_API_KEY`.
4. Click **Deploy**.

## 📍 Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `VITE_OPENWEATHER_API_KEY` | Real-time weather and AQI data | [OpenWeatherMap](https://openweathermap.org/) |
| `GEMINI_API_KEY` | (Optional) For future AI-driven insights | [Google AI Studio](https://aistudio.google.com/) |

---

Developed with ❤️ for the Modern Web.
