# Crypto-XChange

Crypto-XChange is a cryptocurrency market application that enables users to view real-time market data, explore historical price trends, and interact with a rich set of analytics per digital coin. The app also allows users to create accounts, favorite coins, and simulate transactions to track potential investment performance. All market data is sourced from the CoinGecko API.

- **[Live Demo](https://crypto-xchange.netlify.app/)**  

---

## 🚀 Features and Functionality

### 🔐 Authentication
- Secure sign-ups and logins using Firebase Authentication.
- Personalized dashboards with email/password access.

### 📊 Data Visualization
- Interactive charts via Lightweight Charts and TradingView.
- Trends, market analytics, and historical performance visualization.

### 📱 Responsive Design
- Chakra UI ensures a consistent and accessible experience across devices.
- Mobile-first design with adaptive layouts.

### ⚡ Performance Optimization
- Built with Next.js for SSR (Server-Side Rendering) and SSG (Static Site Generation).
- Code splitting, lazy loading, and dynamic imports for faster load times and improved SEO.

---

## 🧩 Key Components

### 🪙 Coin Profile
- Individual coin pages with aggregated data from CoinGecko.
- Includes price charts, statistics, news, external resources, and user actions (watchlist, simulated trades).

### 🎨 Theming
- Light and dark mode via Chakra UI.
- Global theming across UI components with instant theme switching on load.

### 📈 Charts
- Line Charts for 7-day trend overview.
- TradingView charts with interactive tooltips and multiple timeframe support.
- Detailed technical analysis features.

---

## 🏗️ Architecture

### 🔧 Frontend

- **Framework**: [Next.js](https://nextjs.org/) for SSR & SSG
- **UI Library**: [Chakra UI](https://chakra-ui.com/)
- **Charting Libraries**:
  - [Chart.js](https://www.chartjs.org/) – Global visualizations like pie charts.
  - [TradingView](https://www.tradingview.com/widget/) – Interactive coin-level analytics.
- **State Management**: React Context API (`AuthContext.tsx`) for global auth and portfolio state.

### 🛠 Backend & Services

- **Data Source**: CoinGecko API for real-time market data and coin-specific metrics.
- **Authentication & Database**: Firebase Authentication + Firestore
  - OAuth & email/password login.
  - Real-time syncing of watchlists and transactions.
- **Caching & Storage**: AWS S3
  - Historical and global data cached to reduce API load.
  - Static JSON storage for rarely updated data.

---

## 📂 Tech Stack Summary

- **Frontend**: Next.js, React, TypeScript, Chakra UI
- **Charts**: Chart.js, Lightweight Charts, TradingView
- **Authentication**: Firebase
- **Database**: Firebase Firestore
- **APIs**: CoinGecko
- **Cloud Storage**: AWS S3

---

## 📌 Notes

- The app is designed with scalability and performance in mind.
- Emphasis on real-time data accuracy and user experience.
- Modular code structure with reusable components and centralized theming.

---

## 🧪 Getting Started (Local Development)

This project is a [Next.js](https://nextjs.org/) app bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
##🔧 Step1: Clone the Repository
```bash
git clone https://github.com/your-username/crypto-xchange.git
cd crypto-xchange
```
##📦 Step 2: Install Dependencies
```bash
npm install
# or
yarn
```
## 🔐 Step 3: Environment Variables

Create a `.env.local` file in the root of your project and add the following keys. These are required to run Crypto-XChange locally.

---

### 🔥 Firebase (Authentication & Firestore)

| Key                        | Description                                   |
|---------------------------|-----------------------------------------------|
| `FIREBASE_API_KEY`        | Firebase API key for client-side SDKs         |
| `FIREBASE_AUTH_DOMAIN`    | Auth domain, usually in the format `*.firebaseapp.com` |
| `FIREBASE_PROJECT_ID`     | Your Firebase project ID                      |
| `FIREBASE_STORAGE_BUCKET` | Cloud storage bucket for Firebase             |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID       |
| `FIREBASE_APP_ID`         | Unique Firebase app identifier                |

---

### ☁️ AWS S3 (Data Caching & Static Storage)

| Key                     | Description                            |
|------------------------|----------------------------------------|
| `ACCESS_KEY_ID_AWS`    | AWS access key for S3                  |
| `ACCESS_KEY_SECRET_AWS`| AWS secret key for S3                  |

---

### 💰 CoinGecko / Coinbase (Crypto Market Data)

| Key            | Description                            |
|----------------|----------------------------------------|
| `COINBASE_API` | API key for Coinbase or other crypto provider |

---

### 📰 News API (Crypto News Feed)

| Key        | Description                        |
|------------|------------------------------------|
| `NEWS_KEY` | API key for accessing crypto news  |

---

> 🛑 **Important:**  
> Do not commit your `.env.local` file to source control. It should be listed in your `.gitignore` file to protect sensitive information.
##▶️ Step 4: Run the Development Server
```bash
npm run dev
# or
yarn dev
```

MIT License. See `LICENSE` file for details.



