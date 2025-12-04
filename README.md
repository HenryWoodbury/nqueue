# Draft Queue

A Fantasy Draft Application

## Getting Started

### Prerequisites

- Node.js v22.14.0 (use `nvm use` to switch to the correct version)
- Docker and Docker Compose (for PostgreSQL database)
- Clerk account (for authentication)
- Local `.env` file that contains the database URL and Clerk authentication keys

   ```env
   # Database (Docker PostgreSQL)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/draft_queue?schema=public"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```
   
   Replace the Clerk keys with your actual keys from the [Clerk Dashboard](https://dashboard.clerk.com).

### Setup

This setup script uses docker to host the PostgreSQL development database. Modify it if you prefer to host the database a different way.

1. **Install dependencies:**

   ```bash
   npm install
   ```

1. **Start Docker:**

   Start your local version of Docker (i.e. Docker Desktop, Orbstack, etc.)
   
1. **Start the PostgreSQL container**

   ```bash
   docker-compose up -d
   ```
   
   This will start PostgreSQL 16 in a Docker container with:
   - Database name: `draft_queue`
   - Username: `postgres`
   - Password: `postgres`
   - Port: `5432`
   
   To stop the database:

   ```bash
   docker-compose down
   ```
   
   To view database logs:

   ```bash
   docker-compose logs -f db
   ```

1. **Generate Prisma Client and run migrations**
   ```bash
   npm run db:setup
   ```   
   This will create the `drafts` table in your database.

1. **Start the development server:**
   ```bash
   npm run dev
   ```

1. **Open your browser to [http://localhost:3000](http://localhost:3000)**

### Useful Commands

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

**Database:**
- `docker-compose up -d` - Start PostgreSQL database
- `docker-compose down` - Stop PostgreSQL database
- `docker-compose logs -f db` - View database logs
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio database GUI (http://localhost:5555)
- `npm run db:push` - Push schema changes to database (without migrations)

## Technologies at Use

* [Next.js](https://nextjs.org/)
* [Clerk](https://clerk.com/docs/quickstarts/nextjs)
* [Tailwindcss](https://tailwindcss.com/)
* [PostgreSql](https://www.postgresql.org/)


