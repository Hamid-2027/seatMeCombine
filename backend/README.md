# SeatMe Backend

This is the backend service for the SeatMe application built with Node.js and Firebase Cloud Functions.

## Setup

1. Install dependencies:
```bash
npm install
cd functions
npm install
```

2. Initialize Firebase:
```bash
firebase login
firebase init
```

3. Run locally:
```bash
npm run serve
```

4. Deploy to Firebase:
```bash
npm run deploy
```

## API Endpoints

- GET /api/items - Get all items
- POST /api/items - Create a new item

## Environment Setup

Make sure you have:
- Node.js 18 or later
- Firebase CLI installed globally (`npm install -g firebase-tools`)
- Firebase project created and configured
