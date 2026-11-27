# ShopSphere 🛒

> Enterprise-Grade Full-Stack E-Commerce Platform built with Next.js, Express, PostgreSQL, Prisma, Redis, Apache Kafka, Docker, and Kubernetes.

---

## 📌 Architecture Roadmap & Phased Execution

ShopSphere is designed with an **evolutionary architecture**:
1. **Phases 1–9**: Modular Monolith for rapid business logic development, clean domain boundaries, and simplified debugging.
2. **Phases 10–12**: Microservices Decomposition, asynchronous Kafka event-driven workflows, and NGINX API Gateway routing.
3. **Phases 13–18**: DevOps, Containerization, Kubernetes Orchestration, CI/CD, and Prometheus/Grafana Observability.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Cache** | Redis (Cache-aside pattern) |
| **Message Broker** | Apache Kafka |
| **API Gateway / Proxy** | NGINX |
| **Authentication** | JWT (Access Tokens) + HTTP-only Refresh Tokens, RBAC |
| **Payments** | Razorpay (Order creation, signature verification, webhooks) |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (Minikube / Kind / Managed K8s) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Prometheus, Grafana |
| **Testing** | Jest, Supertest, Playwright |

---

## 📂 Project Structure

```
shopsphere/
├── docs/                   # Architecture, ERD, and API Documentation
│   ├── architecture/
│   └── api/
├── frontend/               # Next.js Client Application
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── backend/                # Express & Prisma Backend (Modular Monolith -> Microservices)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.ts
│   └── prisma/
├── infrastructure/         # Docker, K8s, NGINX, and Monitoring configs
│   ├── docker/
│   ├── k8s/
│   ├── nginx/
│   └── monitoring/
└── .github/workflows/      # Automated CI/CD Pipelines
```

---

## 🚀 Development Phases

- [x] **Phase 0: Planning & System Architecture**
- [ ] **Phase 1: Environment & Repository Setup**
- [ ] **Phase 2: Frontend Foundation (Shadcn + Next.js)**
- [ ] **Phase 3: Backend Foundation & PostgreSQL Setup (Prisma)**
- [ ] **Phase 4: Authentication & Authorization (JWT + RBAC)**
- [ ] **Phase 5: Product Catalogue, Image Storage & Search**
- [ ] **Phase 6: Shopping Cart Engine**
- [ ] **Phase 7: Order & Inventory Concurrency Management**
- [ ] **Phase 8: Razorpay Payment Gateway & Webhooks**
- [ ] **Phase 9: High-Performance Redis Caching**
- [ ] **Phase 10: Microservices Decomposition**
- [ ] **Phase 11: Kafka Event-Driven Asynchronous Pipeline**
- [ ] **Phase 12: NGINX Reverse Proxy & API Gateway**
- [ ] **Phase 13: Docker & Multi-Container Setup**
- [ ] **Phase 14: Kubernetes Orchestration & Scaling**
- [ ] **Phase 15: GitHub Actions CI/CD Pipeline**
- [ ] **Phase 16: Prometheus & Grafana Monitoring & Alerting**
- [ ] **Phase 17: Security Hardening & k6 Load Testing**
- [ ] **Phase 18: Production Deployment & Verification**
