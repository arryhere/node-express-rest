# App

---

## Stack

- node
- express
- rest
- mongodb
- mongoose

## Setup

- `npm i`
- `docker compose -f ./compose.db.yaml --env-file ./.env up --build -d`
- `npm run start:dev`

---

## Dev Docker Setup

- `docker compose -f ./compose.dev.yaml --env-file ./.env.dev up --build -d`

---

# Build & Bundling

---

# General Information

- generate unique jwt secret : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

---
