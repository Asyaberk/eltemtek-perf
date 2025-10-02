<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<!-- 
# 📚 NestJS User & Library Management Project

[![NestJS](https://img.shields.io/badge/NestJS-Backend-red)](https://nestjs.com/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)  
[![Redis](https://img.shields.io/badge/Redis-Cache-green)](https://redis.io/)  
[![Kafka](https://img.shields.io/badge/Kafka-Event--Streaming-black)](https://kafka.apache.org/)  
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)

---

## 🔎 Overview
This project was built as part of my learning journey with NestJS and backend systems. The main goal was to simulate a small-scale library management system, but enriched with real-world patterns: authentication, caching, event-driven messaging, and container orchestration.

It is a **full-stack backend system** built with **NestJS**, designed for managing users, roles, and books, while also demonstrating modern backend practices:  

- **PostgreSQL** → relational database for persistent storage  
- **Redis** → caching layer for performance optimization  
- **Kafka** → event-driven architecture for handling book rentals/returns  
- **pgAdmin** → graphical database management tool  
- **Swagger** → interactive API documentation  
- **Docker Compose** → single-command container orchestration  

👉 The goal is to provide a **modular, production-like backend** where each concept (authentication, caching, messaging, persistence) is implemented in its own NestJS module.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Asyaberk/nestjs-user-project.git
cd nestjs-user-project
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```bash
PORT=3000

DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_DATABASE=

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=123
PGADMIN_HOST_PORT=5050
PGADMIN_CONTAINER_PORT=80

REDIS_PORT=6379
REDIS_HOST=redis
REDIS_URL=redis://redis:6379

KAFKA_BROKERS=kafka:9092
KAFKA_TOPIC=topic-test
```

### 3. Kafka Setup – Export Host IP
Create a `.env` file in the root directory:
```bash
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
```

### 4. Start Services
```bash
docker-compose up -d --build
```

### 5. Monitor Logs
```bash
docker logs -f nestjs-project-app
```
This ensures all services (**Postgres, Redis, Kafka, App**) are healthy and running.

---

### 🌐 Available Services
- **API** → http://localhost:3000
- **Swagger Docs** → http://localhost:3000/api
- **pgAdmin** → http://localhost:5050 (login with admin@admin.com / 123)
- **Postgres** → localhost:5432
- **Redis** → localhost:6379
- **Kafka** → localhost:9092

---

### 🔎 Health Check
```bash
curl http://localhost:3000/healthcheck
```
**Expected Response:**
```
{ "status": "ok" }
```

---

### 📖 API Documentation (Swagger)
Once the app is running, visit:
→ http://localhost:3000/api

Here you can:
- Explore available endpoints
- Send test requests directly from the browser
- View request/response schemas

---

### 📦 Project Modules
- **Auth Module** → Registration, login, logout (JWT in HTTP-only cookies).
- **Users Module** → Manage users and their roles.
- **Roles Module** → Define role-based access.
- **Books Module** → CRUD operations for books.
- **Library Module** → Borrowing (rent) and returning (return) books.
- **Kafka Module** → Publishes events like `LIBRARY_RENT_CREATED` and consumes them for logging.
- **Redis Module** → Used for caching frequent queries (e.g., user lists, books).

---

### 📨 Kafka Demo
**Rent a Book (Producer Event)**
```bash
curl -X POST http://localhost:3000/library/rent -H "Content-Type: application/json" -d '{"bookId": 1, "userId": 1}'
```
Consumer Log Output:
```
Received event: LIBRARY_RENT_CREATED
```

**Return a Book**
```bash
curl -X POST http://localhost:3000/library/return/1
```
Consumer Log Output:
```
Received event: LIBRARY_RENT_RETURNED
```

---

### 🗄️ Redis Demo
Check cache content:
```bash
docker exec -it nestjs-project-redis redis-cli
> KEYS *
```

---

### 🛠 Development Mode
To run only the NestJS app (without Docker containers):
```bash
npm install
npm run start:dev
```

---

### ✅ Conclusion
This project demonstrates how **NestJS integrates with PostgreSQL, Redis, and Kafka**, orchestrated
via Docker Compose.
It is a **great starting point** for anyone wanting to learn **microservice-related patterns** and
**event-driven architectures** while keeping everything structured under NestJS modules.
 -->