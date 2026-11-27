# ShopSphere Database Schema & ERD

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o| CART : owns
    USER ||--o{ REFRESH_TOKEN : issues

    CATEGORY ||--o{ PRODUCT : contains
    PRODUCT ||--|| INVENTORY : tracks
    PRODUCT ||--o{ CART_ITEM : included_in
    PRODUCT ||--o{ ORDER_ITEM : ordered_as

    CART ||--o{ CART_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : comprises
    ORDER ||--o| PAYMENT : settled_by
    ORDER ||--|| ADDRESS : ships_to

    USER {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        enum role "CUSTOMER | ADMIN"
        timestamp created_at
        timestamp updated_at
    }

    ADDRESS {
        uuid id PK
        uuid user_id FK
        string street
        string city
        string state
        string postal_code
        string country
        string phone
        boolean is_default
    }

    CATEGORY {
        uuid id PK
        string name UK
        string slug UK
        string description
        timestamp created_at
    }

    PRODUCT {
        uuid id PK
        uuid category_id FK
        string title
        string slug UK
        string description
        decimal price
        string image_url
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    INVENTORY {
        uuid id PK
        uuid product_id FK,UK
        int quantity
        int reserved_quantity
        timestamp updated_at
    }

    CART {
        uuid id PK
        uuid user_id FK,UK
        timestamp updated_at
    }

    CART_ITEM {
        uuid id PK
        uuid cart_id FK
        uuid product_id FK
        int quantity
        timestamp added_at
    }

    ORDER {
        uuid id PK
        uuid user_id FK
        uuid address_id FK
        decimal total_amount
        enum status "PENDING_PAYMENT | CONFIRMED | SHIPPED | DELIVERED | CANCELLED"
        string idempotency_key UK
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }

    PAYMENT {
        uuid id PK
        uuid order_id FK,UK
        string payment_gateway "RAZORPAY"
        string razorpay_order_id UK
        string razorpay_payment_id UK
        string razorpay_signature
        decimal amount
        string currency
        enum status "PENDING | SUCCESS | FAILED"
        timestamp created_at
        timestamp updated_at
    }

    REFRESH_TOKEN {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        timestamp expires_at
        timestamp created_at
    }
```

---

## 2. Table Specifications & Indexes

### `users`
- Primary Key: `id` (UUID)
- Unique Index: `email`
- Fields: `first_name`, `last_name`, `password_hash`, `role` (`CUSTOMER`, `ADMIN`), timestamps

### `products`
- Primary Key: `id` (UUID)
- Foreign Key: `category_id` references `categories(id)` ON DELETE RESTRICT
- Indexes: `category_id`, `price`, `title` (Full Text Search index on `title`, `description`)

### `inventories`
- Primary Key: `id` (UUID)
- Foreign Key: `product_id` references `products(id)` ON DELETE CASCADE
- Constraint: `quantity >= 0`, `reserved_quantity >= 0`, `quantity >= reserved_quantity`

### `orders`
- Primary Key: `id` (UUID)
- Foreign Keys: `user_id`, `address_id`
- Unique Index: `idempotency_key` (Prevents duplicate order submissions)
- Indexes: `user_id`, `status`, `created_at`

### `payments`
- Primary Key: `id` (UUID)
- Foreign Key: `order_id` references `orders(id)`
- Unique Indexes: `razorpay_order_id`, `razorpay_payment_id`
