# ShopSphere System Architecture

## 1. System Overview

ShopSphere uses an **Evolutionary Architectural Approach**:
1. **Initial State (Phases 1-9)**: Modular Monolith where domain boundaries (Auth, Product, Cart, Order, Inventory, Payment) are strictly encapsulated inside modular services/folders within a single Express + Prisma + PostgreSQL codebase.
2. **Intermediate Transition (Phase 10-12)**: Extraction into independent microservices with dedicated databases, an NGINX API Gateway, and asynchronous Kafka event streaming.
3. **Cloud Native Target (Phase 13-18)**: Containerized deployment on Kubernetes with Prometheus/Grafana observability.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    Client["Client (Web Next.js / Mobile)"]

    subgraph Edge ["Edge & Gateway Layer"]
        NGINX["NGINX Reverse Proxy / API Gateway (:80/:443)"]
    end

    subgraph Services ["Backend Microservices Layer"]
        AuthSvc["Auth Service (:4001)"]
        ProductSvc["Product Service (:4002)"]
        OrderSvc["Order Service (:4003)"]
        InventorySvc["Inventory Service (:4004)"]
        PaymentSvc["Payment Service (:4005)"]
        NotifSvc["Notification Service (:4006)"]
    end

    subgraph DataCache ["Data & Cache Layer"]
        PG_Auth[("PostgreSQL: Auth DB")]
        PG_Product[("PostgreSQL: Product DB")]
        PG_Order[("PostgreSQL: Order DB")]
        PG_Inventory[("PostgreSQL: Inventory DB")]
        RedisCache[("Redis Cache Cluster")]
    end

    subgraph EventStream ["Asynchronous Event Backbone"]
        Kafka["Apache Kafka Event Broker"]
        TopicOrder["Topic: order.events"]
        TopicPayment["Topic: payment.events"]
        TopicInventory["Topic: inventory.events"]
    end

    subgraph ExternalServices ["External Providers"]
        Razorpay["Razorpay Payment Gateway"]
        S3["AWS S3 / MinIO (Product Images)"]
        SMTP["Email / SMS Provider"]
    end

    Client -->|HTTPS / REST| NGINX

    NGINX -->|/api/auth/*| AuthSvc
    NGINX -->|/api/products/*| ProductSvc
    NGINX -->|/api/orders/*| OrderSvc
    NGINX -->|/api/inventory/*| InventorySvc
    NGINX -->|/api/payments/*| PaymentSvc

    AuthSvc --> PG_Auth
    ProductSvc --> PG_Product
    ProductSvc <-->|Cache-Aside| RedisCache
    ProductSvc --> S3

    OrderSvc --> PG_Order
    InventorySvc --> PG_Inventory

    PaymentSvc <--> Razorpay

    OrderSvc -.->|Pub: OrderCreated| TopicOrder
    TopicOrder -.->|Sub| InventorySvc
    TopicOrder -.->|Sub| PaymentSvc

    PaymentSvc -.->|Pub: PaymentCompleted / Failed| TopicPayment
    TopicPayment -.->|Sub| OrderSvc
    TopicPayment -.->|Sub| NotifSvc

    NotifSvc --> SMTP
```

---

## 3. Asynchronous Order Execution Flow (Saga Pattern)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as Next.js Client
    participant OrderSvc as Order Service
    participant Kafka as Apache Kafka
    participant InvSvc as Inventory Service
    participant PaySvc as Payment Service
    participant NotifSvc as Notification Service

    Customer->>Frontend: Place Order & Confirm Checkout
    Frontend->>OrderSvc: POST /api/orders (Items, Shipping Address)
    OrderSvc->>OrderSvc: Create Order (Status: PENDING_PAYMENT)
    OrderSvc-->>Frontend: 201 Created (OrderId, Amount)
    OrderSvc->>Kafka: Publish `OrderCreated`

    Kafka->>InvSvc: Consume `OrderCreated`
    InvSvc->>InvSvc: Reserve Stock (Atomic Conditional Update)
    alt Out of Stock
        InvSvc->>Kafka: Publish `StockReservationFailed`
        Kafka->>OrderSvc: Update Order Status -> CANCELLED
    else Stock Reserved
        InvSvc->>Kafka: Publish `StockReserved`
    end

    Customer->>Frontend: Submit Payment (Razorpay Checkout)
    Frontend->>PaySvc: Verify Payment Signature / Webhook
    PaySvc->>Kafka: Publish `PaymentCompleted`

    Kafka->>OrderSvc: Consume `PaymentCompleted`
    OrderSvc->>OrderSvc: Transition Status -> ORDER_CONFIRMED
    OrderSvc->>Kafka: Publish `OrderConfirmed`

    Kafka->>NotifSvc: Consume `OrderConfirmed`
    NotifSvc->>Customer: Send Email / SMS Order Confirmation
```

---

## 4. Key Architectural Guarantees & Patterns

1. **Idempotency**: All payment webhooks and Kafka consumers use idempotency keys stored in Redis/PostgreSQL to prevent duplicate deductions or duplicate order processing.
2. **Concurrency Control in Inventory**: PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) or atomic conditional updates (`UPDATE inventory SET stock = stock - qty WHERE product_id = ? AND stock >= qty`) to prevent overselling.
3. **Cache-Aside Pattern**: Read product/category data from Redis first; on cache miss, query PostgreSQL, set with TTL (Time-To-Live), and return. Cache is invalidated on product update/delete.
4. **Security by Design**:
   - Access tokens (Short-lived, 15m) in memory / headers.
   - Refresh tokens (Long-lived, 7d) stored securely in `HttpOnly`, `SameSite=Strict` cookies.
   - Role-Based Access Control (`CUSTOMER`, `ADMIN`).
   - Rate limiting via Redis on critical endpoints (login, checkout).
