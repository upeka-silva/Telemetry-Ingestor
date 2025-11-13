# Telemetry Ingestor (NestJS + TypeScript)

Minimal IoT Telemetry Ingestor to accept JSON readings, store in MongoDB, cache latest per device in Redis, and raise alerts when thresholds are exceeded.

---

## Features

- **POST /api/v1/telemetry** – Accept single or batch telemetry readings, validate, store in MongoDB, cache latest in Redis.
- **Alerting** – Send alerts to a webhook if temperature > 50°C or humidity > 90%.
- **GET /api/v1/devices/:deviceId/latest** – Fetch latest telemetry (Redis first, MongoDB fallback).
- **GET /api/v1/sites/:siteId/summary?from=ISO&to=ISO** – Aggregated metrics: count, average/max temperature, average/max humidity, unique devices.
- **DTO validation** using `class-validator` and `class-transformer`.
- Optional **bearer token auth** via `INGEST_TOKEN`.

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/upeka-silva/Telemetry-Ingestor.git
cd Telemetry-Ingestor
```
