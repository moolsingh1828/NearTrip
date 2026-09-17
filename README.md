# Roamly

> Discover nearby. Decide quickly. Go together.

Roamly is a location-aware discovery web app for the real-world problem: one person in a friend group wants to suggest somewhere to go, but finding a place, checking whether it is worth the trip, getting directions, and sharing useful information takes too much effort.

## Product rules

Roamly intentionally does **not** use:

- Create/join groups
- Polls or voting
- In-app group chat
- Mandatory authentication

The intended flow is:

`Open → Location → Discover → Inspect → Route → Share → Go`

## Stack

### Frontend
- React + Vite
- React Router
- Leaflet
- OpenStreetMap tiles
- Responsive custom CSS

### Backend
- Node.js + Express
- MongoDB/Mongoose (optional, used for persistent share links)
- OpenStreetMap Overpass for nearby POI discovery
- OSRM for routing
- Amazon Bedrock via AWS SDK for JavaScript v3 (optional AI query interpretation)

## Why these providers?

For a hackathon-friendly starter, the project uses open mapping data rather than forcing a paid maps stack. OpenStreetMap requires visible attribution and its public tile service is best-effort with usage restrictions; the project therefore keeps the tile URL centralized in the `MapView` component so it can be replaced with a production tile provider later. Overpass public instances are intended for smaller projects, not unlimited production traffic. OSRM exposes route distance/duration and GeoJSON geometry. See the official provider policies/docs before public deployment.

## Features included

- Browser geolocation with Bhopal demo fallback
- Nearby place discovery
- Category filters
- Hidden-gem mode
- Natural-language recommendation endpoint
- Deterministic recommendation fallback when Bedrock is not configured
- Interactive Leaflet map
- Route drawing and ETA/distance
- Place details
- Shareable place links
- Optional MongoDB persistence for shared links
- Responsive UI
- AWS Bedrock integration point

## Project structure

```text
roamly/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Run locally

### 1. Requirements

- Node.js 20+ recommended
- npm
- Optional: MongoDB
- Optional: AWS credentials with permission to invoke the selected Bedrock model

### 2. Install

From the project root:

```bash
npm install
npm run install:all
```

### 3. Configure server

Copy `server/.env.example` to `server/.env`.

Minimum local configuration:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

For persistent share links:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/roamly
```

For Bedrock:

```env
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=global.anthropic.claude-haiku-4-5-20251001-v1:0
```

Use your normal AWS credential provider chain. Do not commit credentials to Git.

### 4. Configure client

Copy `client/.env.example` to `client/.env`.

The default demo location is Bhopal. This is only a fallback when the browser cannot provide location permission.

### 5. Start

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## AWS note

The AI endpoint uses Amazon Bedrock's `Converse` API through `@aws-sdk/client-bedrock-runtime`. The app gracefully falls back to a local query parser if Bedrock is not configured or temporarily unavailable. This means the core demo remains runnable while AWS is being configured.

For the hackathon submission, configure a real AWS-backed feature and document exactly what AWS does in the architecture.

## Important mapping/provider note

The public OpenStreetMap services used here are appropriate as a development/hackathon starting point, not an assumption of unlimited production capacity. Before a large public launch, replace them with a provider/hosted stack that matches your expected traffic and licensing requirements. Keep OSM attribution when OSM data/tiles are used.

## Hackathon execution order

1. Verify location → nearby places.
2. Verify map markers.
3. Verify place details.
4. Verify routing.
5. Verify share links.
6. Configure Bedrock and test natural-language recommendations.
7. Deploy frontend/backend.
8. Replace public provider endpoints if your traffic/deployment requirements require it.
9. Record the 3-minute demo.

## Deliberate engineering choices

- No auth in MVP: it does not contribute to the core user journey.
- No groups/polls: the website supports the person who discovers and shares the idea; the social decision happens outside the app.
- Provider integrations are isolated in backend services so they can be replaced without rewriting React UI.
- External provider failure has a controlled fallback for development/demo mode.
- Route geometry is returned as GeoJSON and rendered as a Leaflet polyline.
- API keys and secrets are server-side only.
