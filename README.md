# 🌱 SproutBiz

**A Crowdfunding and Investment Platform**

SproutBiz is a full-stack crowdfunding and investment web application that connects founders seeking funding with users interested in supporting their campaigns. It provides campaign discovery, investment tracking, user profiles, and payment functionality through a React frontend and a Node.js/Express backend.

## ✨ Features

- **Campaign Management** — Browse campaigns and view funding goals, amounts raised, progress, and investment details.
- **User Accounts** — Manage user profiles and access campaign and investment information.
- **Investment Tracking** — Track investments and view relevant information through an investor dashboard.
- **Stripe Checkout** — Support standard investments through Stripe's hosted checkout flow.
- **Payment Success Flow** — Retrieve checkout session details and submit investment information to the backend.
- **Campaign Updates** — Update campaign funding totals and investor records after the payment flow completes.
- **Crypto Payment Experiment** — Includes a MetaMask integration prototype for initiating ETH transfers.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Standard Payments | Stripe Checkout |
| Wallet Integration | MetaMask injected provider |
| Development | Git, GitHub |

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │      React UI       │
                 │ Campaigns & Dashboard│
                 └──────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
      ┌───────▼────────┐        ┌─────────▼────────┐
      │ Stripe Checkout│        │ MetaMask Wallet  │
      │ Standard Payment│       │ Crypto Prototype │
      └───────┬────────┘        └──────────────────┘
              │
      ┌───────▼────────┐
      │ Express Backend│
      │ REST API       │
      └───────┬────────┘
              │
      ┌───────▼────────┐
      │    MongoDB     │
      │ Campaigns,     │
      │ Users, Records │
      └────────────────┘
```

## 💳 Payment Workflows

### Stripe Checkout

The standard investment flow uses Stripe Checkout.

1. A user initiates an investment.
2. The backend creates a Stripe Checkout session.
3. The user completes checkout through Stripe.
4. The application retrieves session-related information on the success page.
5. The frontend submits investment information to the backend.
6. The backend updates campaign totals and investor records.

**Implementation note:** The current success-page flow is working in local development, but it is a temporary implementation. A production deployment should verify payment completion server-side, preferably using verified Stripe webhooks, and process each payment idempotently to prevent duplicate investment records.

### MetaMask Crypto Prototype

The crypto feature currently connects to MetaMask and can initiate a direct ETH transfer to a hardcoded wallet address.

Current limitations:

- No deployed investment smart contract.
- No contract-based investment or equity allocation.
- No enforced blockchain network selection.
- No backend verification that a transaction was confirmed on the intended network and sent to the expected recipient.
- Investment records may be updated based on a transaction hash returned by MetaMask without sufficient independent verification.

**Security warning:** Do not use the current crypto flow with real funds. A MetaMask connection or returned transaction hash does not, by itself, establish that an investment was successfully and correctly completed.

Future development can either implement a clearly labeled simulated demo or integrate a properly deployed testnet smart contract with transaction verification.

## 🚀 Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB or a MongoDB Atlas connection
- A Stripe account and test API keys
- MetaMask only if exploring the crypto prototype

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your GitHub repository URL and project directory.

### 2. Install dependencies

Install dependencies in the frontend and backend directories:

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

Replace `client` and `server` with the actual directory names in your repository if they differ.

### 3. Configure environment variables

Create the required `.env` files based on the variable names used in your existing code.

Example backend configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_test_secret_key
```

Example frontend configuration, if required by your implementation:

```env
VITE_API_BASE_URL=http://localhost:5000
```

These are illustrative examples. Check your source code for the exact environment variable names and required configuration.

**Never commit API keys, database credentials, wallet private keys, or other secrets to GitHub.** Add `.env` files to `.gitignore` and use test credentials during development.

### 4. Start the backend

From the backend directory, run the command configured in its `package.json`, commonly:

```bash
npm run dev
```

### 5. Start the frontend

From the frontend directory, run:

```bash
npm run dev
```

Vite commonly serves the frontend at:

```text
http://localhost:5173
```

The backend port and startup commands depend on your project configuration.

## 📁 Project Structure

An illustrative structure for this application is:

```text
SproutBiz/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── index.js
│
├── .gitignore
└── README.md
```

Adjust this structure to match the actual repository.

## 🔐 Security Considerations

- Keep secret keys and database credentials in environment variables.
- Use Stripe's test mode during development.
- Verify payment completion on the backend before recording investments.
- Make payment processing idempotent to prevent duplicate records.
- Validate investment amounts and campaign identifiers on the server.
- Never trust client-submitted payment status or transaction hashes without verification.
- Restrict crypto testing to a test network until the complete transaction flow is implemented and verified.
- Do not store wallet private keys in the frontend or backend.

## 🗺️ Future Improvements

- [ ] Verify Stripe payments using signed webhooks.
- [ ] Add idempotent payment processing.
- [ ] Improve investment history and transaction status tracking.
- [ ] Add stronger validation and error handling.
- [ ] Implement a simulated crypto investment mode for demonstrations.
- [ ] Alternatively, deploy a testnet smart contract and verify transactions server-side.
- [ ] Add automated backend and frontend tests.
- [ ] Add deployment documentation and production configuration.
- [ ] Improve accessibility, responsive design, and loading states.

## 🎯 Project Goal

SproutBiz aims to provide a straightforward platform for discovering fundraising campaigns, supporting founders, and tracking investments through a unified interface.

The project also serves as a practical exploration of full-stack development, payment integration, database-backed workflows, and blockchain wallet connectivity.

## ⚠️ Disclaimer

SproutBiz is a development project. Its current crypto functionality is a prototype and must not be treated as a secure investment or equity-allocation system. The application has not been established as production-ready for real-money investment processing.

## 👨‍💻 Author

**Chetan Seth**

B.Tech Information Technology | Full-Stack Development | AI Applications

