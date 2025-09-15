# Financial Web Application

A modern financial web application built with React, TypeScript, and Convex.

## Features

- User authentication and session management
- Account management
- Transaction history
- Fund transfers
- Admin dashboard for user management
- Mobile-responsive design

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Bun or npm


### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```

```

### Installation

1. Install dependencies:
   ```
   bun install
   # or
   npm install
   ```

2. Start the development server:
   ```
   bun run dev
   # or
   npm run dev
   ```

3. Build for production:
   ```
   bun run build
   # or
   npm run build
   ```

## Admin Portal

The admin portal is accessible at `/wellgofar`. This is where you can:

1. Create user accounts
2. Add balance to accounts
3. View and manage existing accounts

### Admin Authentication



- Username: admin
- Password: admin123

## User Authentication

Regular users (created by the admin) use a simple username/password authentication stored in the database.

Sample user credentials:
- Username: user1
- Password: password123
