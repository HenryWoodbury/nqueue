import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

import { apiError, apiSuccess, handlePrismaError } from '@/lib/api-helpers'
import type { CreateDraftRequest } from '@/types/api'

// Get all drafts
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError('Unauthorized', 401)
    }

    const drafts = await prisma.draft.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess(drafts)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// POST - Create a new draft
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError('Unauthorized', 401)
    }

    const body: CreateDraftRequest = await request.json()
    const { draftName } = body

    // Validate input
    if (!draftName || typeof draftName !== 'string') {
      return apiError('draftName is required and must be a string', 400)
    }

    // Trim and validate length
    const trimmedName = draftName.trim()
    if (trimmedName.length === 0) {
      return apiError('draftName cannot be empty', 400)
    }

    if (trimmedName.length > 255) {
      return apiError('draftName must be 255 characters or less', 400)
    }

    const draft = await prisma.draft.create({
      data: {
        draftName: trimmedName,
        userId,
      },
    })

    return apiSuccess(draft, 201)
  } catch (error) {
    return handlePrismaError(error)
  }
}


