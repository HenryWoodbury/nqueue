import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function handlePrismaError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case 'P2025':
        // Record not found
        return apiError('Resource not found', 404)
      case 'P2002':
        // Unique constraint violation
        return apiError('A record with this value already exists', 409)
      case 'P2003':
        // Foreign key constraint violation
        return apiError('Invalid reference', 400)
      default:
        console.error('Prisma error:', error)
        return apiError('Database error occurred', 500)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma validation error:', error)
    return apiError('Invalid data provided', 400)
  }

  // Handle unknown errors
  console.error('Unexpected error:', error)
  return apiError('An unexpected error occurred', 500)
}

