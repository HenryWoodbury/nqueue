# Draft Queue

A Fantasy Draft Application

## Getting Started

### Prerequisites

- Node.js v22.14.0 (use `nvm use` to switch to the correct version)
- Docker and Docker Compose (for PostgreSQL database)
- Clerk account (for authentication)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database with Docker:**
   
   Start the PostgreSQL container:
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

3. **Create a `.env` file in the root directory:**
   ```env
   # Database (Docker PostgreSQL)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/draft_queue?schema=public"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```
   
   Replace the Clerk keys with your actual keys from the [Clerk Dashboard](https://dashboard.clerk.com).

4. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```
   
   This will create the `drafts` table in your database.

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:push` - Push schema changes to database (without migrations)

## Technologies at Use

* [Next.js](https://nextjs.org/)
* [Clerk](https://clerk.com/docs/quickstarts/nextjs)
* [Tailwindcss](https://tailwindcss.com/)
* [PostgreSql](https://www.postgresql.org/)

## Tutorials and Guides

* [Next.js Tutorial With Local Database: Quick Start Guide](https://medium.com/@dekadekadeka/next-js-tutorial-with-local-database-quick-start-guide-394d48a0aada) by Deka Ambia

