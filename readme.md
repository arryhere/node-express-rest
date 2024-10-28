# App

##### Stack

- node
- nest
- rest api
- mongodb
- mongoose

##### Initial Setup

- npm i
- docker compose -f ./compose.db.yaml --env-file ./.env up --build -d
- npm run start:dev

- dev: docker compose -f ./compose.dev.yaml --env-file ./.env.dev up --build -d

---

# Build & Bundling

---

# General Information

- generate unique jwt secret : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
