# ShopSphere REST API Specifications

Base URL: `/api/v1`

---

## 1. Authentication & Users (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT tokens | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token using refresh token cookie | No (Cookie) |
| `POST` | `/api/v1/auth/logout` | Revoke refresh token and clear cookie | Yes |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes |

---

## 2. Products & Categories (`/api/v1/products`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/categories` | List all categories | No |
| `POST` | `/api/v1/categories` | Create category | Admin |
| `GET` | `/api/v1/products` | Query products (pagination, filter by price, category, search) | No |
| `GET` | `/api/v1/products/:id` | Fetch single product with stock details | No |
| `POST` | `/api/v1/products` | Create product & initial inventory | Admin |
| `PUT` | `/api/v1/products/:id` | Update product details | Admin |
| `DELETE` | `/api/v1/products/:id` | Soft delete / remove product | Admin |

**Query Parameters for `GET /api/v1/products`**:
- `page`: default `1`
- `limit`: default `12`
- `search`: string search across title & description
- `category`: category slug
- `minPrice`: number
- `maxPrice`: number
- `sort`: `price_asc` | `price_desc` | `newest`

---

## 3. Shopping Cart (`/api/v1/cart`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/cart` | Get current customer's cart | Customer |
| `POST` | `/api/v1/cart/items` | Add product to cart | Customer |
| `PUT` | `/api/v1/cart/items/:id` | Update item quantity in cart | Customer |
| `DELETE` | `/api/v1/cart/items/:id`| Remove item from cart | Customer |
| `DELETE` | `/api/v1/cart` | Clear entire cart | Customer |

---

## 4. Orders & Checkout (`/api/v1/orders`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/orders` | Checkout cart and place order | Customer |
| `GET` | `/api/v1/orders` | Customer's order history | Customer |
| `GET` | `/api/v1/orders/:id` | Get order status and details | Customer / Admin |
| `POST` | `/api/v1/orders/:id/cancel` | Cancel order & release inventory | Customer / Admin |
| `GET` | `/api/v1/admin/orders` | Admin view of all platform orders | Admin |
| `PUT` | `/api/v1/admin/orders/:id/status` | Update fulfillment status (`SHIPPED`, `DELIVERED`) | Admin |

---

## 5. Payments (`/api/v1/payments`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/payments/create-order` | Generate Razorpay order for an existing order | Customer |
| `POST` | `/api/v1/payments/verify` | Verify Razorpay payment signature | Customer |
| `POST` | `/api/v1/payments/webhook` | Webhook endpoint for Razorpay event callbacks | No (HMAC Signature) |

---

## 6. Standard API Response Structure

### Success:
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Requested quantity exceeds available stock.",
    "details": []
  }
}
```
