# FitVerse AI ⚡🧠

> **Adaptive Fitness Operating System**
> Continuously personalizes workouts, nutrition, recovery, and progress around your body, goals, preferences, and real-time execution data.

---

## 🌟 Overview

**FitVerse AI** is not a generic fitness tracker. It is an end-to-end, responsive mobile fitness application engineered with React Native, Expo Router, and a dedicated OpenAI-powered backend intelligence layer.

The app demonstrates the full adaptive product loop:
```
USER PROFILE & BODY METRICS
            ↓
GOALS & NUTRITION PREFERENCES
            ↓
OPENAI PERSONALIZATION ENGINE
            ↓
ADAPTIVE WORKOUTS & MACRONUTRIENT PLANS
            ↓
LIVE WORKOUT EXECUTION & REST TIMERS
            ↓
PROGRESS & BIOMETRIC ANALYTICS
            ↓
AI RECOVERY ANALYSIS & PLAN ADAPTATION
```

---

## 🚀 Key Features

- **Personalized Onboarding**: Multi-step flow capturing biometrics, training styles, weekly frequencies, dietary preferences, and metabolic targets.
- **AI Plan Generation**: Real-time structured generation powered by OpenAI with deterministic fallback safeguards.
- **Live Workout Mode**: Interactive exercise tracker with rep/set logging, interactive rest timers, heart-rate simulation, and workout completion celebration.
- **Adaptive Nutrition**: Macro breakdowns (Protein, Carbs, Fats, Calories), meal schedules, and one-tap AI-assisted meal swaps.
- **Biometric Analytics**: Visual progress charts, volume load tracking, and recovery readiness scoring.
- **AI Plan Adaptation**: Analyzes real user workout feedback, soreness, fatigue, and milestones to adapt upcoming routines.
- **Design System & Glassmorphism**: Custom atmospheric dark palette (`#200F0D`), multi-level glassmorphic surfaces, crimson glows (`#FF544A`), cyan neural accents (`#6BD3FD`), and responsive typography.
- **Secure Backend Proxy**: OpenAI API keys stay safely server-side; mobile app communicates with structured API endpoints.

---

## 🛠️ Tech Stack

### Mobile Client
- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 52)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with AsyncStorage persistence
- **Animations & Glass**: `react-native-reanimated`, `expo-blur`, `expo-linear-gradient`
- **Graphics & Icons**: `react-native-svg`, `@expo/vector-icons`
- **Language**: TypeScript (Strict typing, 0 lint/tsc errors)

### Backend Service
- **Runtime**: Node.js / Express
- **AI Engine**: OpenAI API (`gpt-4o-mini` structured JSON outputs)
- **Security**: CORS, dotenv environment segregation, defensive demo fallbacks

---

## 📁 Project Structure

```
FITVERSE_AI/
├── app.json                  # Expo config & plugins
├── package.json              # Client dependencies
├── server/                   # Backend AI Proxy
│   ├── package.json
│   └── server.js             # Express server with OpenAI endpoints
├── src/
│   ├── app/                  # Expo Router screens
│   │   ├── _layout.tsx       # Root layout & providers
│   │   ├── index.tsx         # App entry & splash redirect
│   │   ├── (auth)/           # Welcome, login, signup
│   │   ├── onboarding/       # Multi-step onboarding & AI generation
│   │   ├── (app)/            # Main tab navigators (Home, Plans, Stats, Profile)
│   │   ├── workout/          # Plan detail & live workout tracker
│   │   ├── nutrition/        # Nutrition breakdown & meal swapping
│   │   ├── premium.tsx       # Subscription tiers & paywall
│   │   └── settings.tsx      # System preferences & profile settings
│   ├── components/           # Reusable UI & Glassmorphic design system
│   ├── services/             # API clients & OpenAI communication
│   ├── stores/               # Zustand persistent state stores
│   ├── theme/                # Design tokens (colors, radii, spacing, typography)
│   ├── types/                # Domain models & TypeScript definitions
│   └── utils/                # Biometric calculations, formatters & demo data
└── .env.example              # Environment variables template
```

---

## 🚦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Expo Go](https://expo.dev/go) app on your mobile device (iOS or Android) or a simulator

### 2. Clone & Install

```bash
git clone https://github.com/Karunarahul/FitVerse-AI.git
cd FitVerse-AI

# Install client dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

Create `.env` inside the `server/` directory:

```bash
cp .env.example server/.env
```

Add your OpenAI API key inside `server/.env`:
```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Running the Project

#### Step A: Start the Backend AI Server
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

#### Step B: Start the Expo Mobile Client
In a separate terminal:
```bash
npm start
# or npx expo start
```
Scan the QR code with your camera (iOS) or Expo Go app (Android).

---

## 🛡️ Security

- The client application never embeds or leaks sensitive credentials.
- All OpenAI prompts and API interactions are routed through the backend proxy (`server/server.js`).
- `.env` files are strictly excluded from version control.

---

## 📄 License

This project is licensed under the NetiSolutions License.
