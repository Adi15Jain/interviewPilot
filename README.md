# InterviewPilot

InterviewPilot is a modern web application built with Next.js that helps users practice and conduct AI-driven interviews. It features AI voice and video processing, database integration, and authentication to provide a seamless interview experience.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
- **AI & Video:**
    - Vapi AI for voice workflows
    - Google Generative AI integration
    - MediaPipe for vision/emotion tracking
- **Email:** [Resend](https://resend.com/)
- **UI Components:** Framer Motion, Recharts, Radix UI

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database (e.g., Neon)

### Installation

1. Clone the repository:

    ```bash
    git clone <repo-url>
    cd interviewpilot
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:
   Copy `.env.example` (or create a new `.env.local` file) and provide the necessary API keys. See [Environment Variables](#environment-variables) below.

4. Initialize the database:

    ```bash
    npm run prisma:generate
    npm run prisma:push
    ```

5. Start the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Environment Variables

Create a `.env.local` file in the root directory and add the following keys. Make sure to fill in your own values for each service.

```env
# Database Configuration (PostgreSQL URL, e.g., NeonDB)
DATABASE_URL="postgresql://user:password@host/database_name?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret" # Run `openssl rand -base64 32` to generate a secret
JWT_SECRET="your-jwt-secret"

# App URL Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Update for production

# Vapi AI Constants
NEXT_PUBLIC_VAPI_WEB_TOKEN="your-vapi-web-token"
NEXT_PUBLIC_VAPI_WORKFLOW_ID="your-vapi-workflow-id"

# Google AI & OAuth
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Configuration (Resend)
RESEND_API_KEY="your-resend-api-key"

# Background Jobs / Cron Secret
CRON_SECRET="your-cron-secret-string"
```

## Available Scripts

- `npm run dev`: Starts the local development server with Turbopack.
- `npm run build`: Generates the Prisma client and builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs Next.js ESLint configuration.
- `npm run prisma:generate`: Generates Prisma Client.
- `npm run prisma:push`: Pushes schema state to the database (without migrations).
- `npm run prisma:migrate`: Creates and applies a new Prisma migration.

## License

This project is licensed under the MIT License.
