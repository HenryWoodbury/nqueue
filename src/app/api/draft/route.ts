import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, handlePrismaError } from '@/lib/api-helpers'
import type { CreateDraftRequest, UpdateDraftRequest } from '@/types/api'

// GET - Fetch all drafts or a single draft by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const draft = await prisma.draft.findUnique({
        where: { id },
      })

      if (!draft) {
        return apiError('Draft not found', 404)
      }

      return apiSuccess(draft)
    }

    const drafts = await prisma.draft.findMany({
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
      },
    })

    return apiSuccess(draft, 201)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PUT - Update an existing draft
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateDraftRequest = await request.json()
    const { id, draftName } = body

    // Validate input
    if (!id || !draftName) {
      return apiError('id and draftName are required', 400)
    }

    if (typeof draftName !== 'string') {
      return apiError('draftName must be a string', 400)
    }

    // Trim and validate length
    const trimmedName = draftName.trim()
    if (trimmedName.length === 0) {
      return apiError('draftName cannot be empty', 400)
    }

    if (trimmedName.length > 255) {
      return apiError('draftName must be 255 characters or less', 400)
    }

    const draft = await prisma.draft.update({
      where: { id },
      data: { draftName: trimmedName },
    })

    return apiSuccess(draft)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE - Delete a draft
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return apiError('id is required', 400)
    }

    await prisma.draft.delete({
      where: { id },
    })

    return apiSuccess({ message: 'Draft deleted successfully' })
  } catch (error) {
    return handlePrismaError(error)
  }
}

