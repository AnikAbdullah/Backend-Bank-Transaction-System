<div align="center">

# Backend Bank Transaction System

A simple banking backend API built with Node.js, Express, MongoDB, JWT authentication, and ledger-based transactions.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## Overview

This project is a backend system for basic bank account and transaction operations. Users can register, log in, create accounts, check balances, and transfer money between accounts.

Balances are calculated from ledger entries instead of being stored directly, making the transaction history easier to track.

---

## Features

- User registration and login
- JWT-based authentication
- Logout with token blacklist
- Create bank accounts
- View user accounts
- Check account balance
- Transfer money between accounts
- Idempotency key support for safer transactions
- Ledger-based debit and credit records
- Email notification service with Nodemailer

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime |
| Express.js | API framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email service |

---

## Project Structure

```txt
.
+-- server.js
+-- package.json
+-- src
    +-- app.js
    +-- config
    |   +-- db.js
    +-- controllers
    |   +-- account.controller.js
    |   +-- auth.controller.js
    |   +-- transaction.controller.js
    +-- middleware
    |   +-- auth.middleware.js
    +-- models
    |   +-- account.model.js
    |   +-- blackList.model.js
    |   +-- ledger.model.js
    |   +-- transaction.model.js
    |   +-- user.model.js
    +-- routes
    |   +-- account.routes.js
    |   +-- auth.routes.js
    |   +-- transaction.routes.js
    +-- services
        +-- email.service.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnikAbdullah/Backend-Bank-Transaction-System.git
cd Backend-Bank-Transaction-System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/bank-transaction-system
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

### 4. Run the server

```bash
npm run dev
```

The server will start at:

```txt
http://localhost:3000
```

---

## API Routes

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Accounts

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/accounts` | Create a bank account |
| GET | `/api/accounts` | Get logged-in user's accounts |
| GET | `/api/accounts/balance/:accountId` | Get account balance |

### Transactions

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/transactions` | Transfer money |
| POST | `/api/transactions/system/initial-funds` | Add initial funds as a system user |

---

## Example Request

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Transfer Money

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fromAccount": "SOURCE_ACCOUNT_ID",
    "toAccount": "DESTINATION_ACCOUNT_ID",
    "amount": 500,
    "idempotencyKey": "unique-transfer-key-001"
  }'
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm test` | Test script placeholder |

---

## Notes

- MongoDB transactions require a replica set or a compatible MongoDB Atlas cluster.
- Protected routes require a JWT token.
- Account balances are calculated from ledger entries.
- Ledger entries are designed to be immutable.

---

<div align="center">

Made with Node.js, Express, and MongoDB.

</div>
