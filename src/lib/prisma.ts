import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Check if using Prisma Accelerate (production)
  const isAccelerate = databaseUrl.startsWith('prisma://')
  
  if (isAccelerate) {
    // Production: Use Prisma Accelerate
    // Only import when actually needed to avoid validation errors
    const { withAccelerate } = require('@prisma/extension-accelerate')
    const extendedClient = new PrismaClient({
      accelerateUrl: databaseUrl 
    }).$extends(withAccelerate())
    // Cast to PrismaClient to preserve model access while keeping Accelerate functionality
    return extendedClient as any as PrismaClient
  } else {
    // Local development: Use pg adapter (no Accelerate)
    // PrismaPg can accept connectionString directly or a Pool instance
    const adapter = new PrismaPg({ connectionString: databaseUrl })
    return new PrismaClient({ adapter })
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | PrismaClient
}

const prisma = (globalThis.prisma ?? prismaClientSingleton()) as PrismaClient

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
