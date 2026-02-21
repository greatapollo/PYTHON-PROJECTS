# EasyFlow

A producer and consumer product flow system without middleman interference, using QR codes to enhance efficiency and avoid discrepancies.

## Project Structure

```
easyflow/
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # QR code utilities
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── database/          # SQLite database directory
│   ├── .env.example
│   └── package.json
└── frontend/         # React + Vite app
    ├── src/
    │   ├── api/           # API client
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── styles/        # CSS styles
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Getting Started

### Backend Setup

```bash
cd easyflow/backend
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
npm install
npm run dev
```

The backend runs on http://localhost:3000

### Frontend Setup

```bash
cd easyflow/frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on http://localhost:5173

## Features

- **User Authentication**: Register and login with JWT tokens
- **Product Management**: Create, read, update, delete products
- **QR Code Generation**: Each product can have a QR code for tracking
- **Search & Filter**: Search products by name or batch number
- **Pagination**: Paginated product listings
- **Responsive UI**: Modern responsive design with Tailwind CSS

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/test` - Health check

### Products (requires authentication)
- `GET /api/products` - List products (with search, sort, pagination)
- `POST /api/products` - Create a product
- `GET /api/products/:id` - Get a single product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
