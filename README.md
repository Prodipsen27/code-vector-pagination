# code-vector-pagination

A Node.js backend to browse 200,000 products, filter by category, and paginate through them quickly using cursor-based pagination.

## Tech Stack
- **Node.js** & **Express**
- **PostgreSQL** (via Supabase)
- **postgres.js** for raw SQL queries and batch inserts

## Features
- **Cursor Pagination:** Ensures users don't see duplicate products or miss any products even if new data is inserted while browsing.
- **Microsecond Precision:** Timestamps are cast to text to avoid precision loss when parsing in Javascript.
- **Batch Seeding:** `seed.js` script inserts 200,000 records in batches of 1000 for extremely fast seeding.
- **Optimized Indexes:** Utilizes multi-column indexing for fast sorting and filtering without full table scans.

## Running Locally

1. Create a `.env` file with your `DATABASE_URL`
2. Run `npm install`
3. Run `node seed.js` to populate the database
4. Run `node src/index.js` to start the Express server

Access the API at:
- `http://localhost:3000/products`
- `http://localhost:3000/products?category=Electronics`
- `http://localhost:3000/products?cursor=...`
