# Restaurant360 Backend

This Express backend provides the API for the Restaurant360 POS dashboard and restaurant operations app.

## Install

```bash
npm install
```

## Run

```bash
node app.js
```

## Environment

Create a `.env` file based on `.env.example`.

## Database

The app is configured to connect to MongoDB at:

```bash
mongodb://127.0.0.1:27017/restaurant360
```

## Seed database

```bash
node config/seed.js
```
