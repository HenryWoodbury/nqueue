import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import type { UpdateDraftRequest } from "@/types/api"

import { apiError, apiSuccess, handlePrismaError } from "@/lib/api-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError("Unauthorized", 401)
    }

    const { id } = await params

    const draft = await prisma.draft.findUnique({
      where: { id },
    })

    if (!draft) {
      return apiError("Draft not found", 404)
    }

    // Disable the type issue until I get around to fixing this whole endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((draft as any).commissioner !== userId) {
      return apiError("Unauthorized", 403)
    }

    return apiSuccess(draft)
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError("Unauthorized", 401)
    }

    const id = params.id

    const body: UpdateDraftRequest = await request.json()
    const { draftName } = body

    // Validate input
    if (!id || !draftName) {
      return apiError("id and draftName are required", 400)
    }

    if (typeof draftName !== "string") {
      return apiError("draftName must be a string", 400)
    }

    // Trim and validate length
    const trimmedName = draftName.trim()

    if (trimmedName.length === 0) {
      return apiError("draftName cannot be empty", 400)
    }

    if (trimmedName.length > 255) {
      return apiError("draftName must be 255 characters or less", 400)
    }

    // First check if draft exists and belongs to user
    const existingDraft = await prisma.draft.findUnique({
      where: { id },
    })

    if (!existingDraft) {
      return apiError("Draft not found", 404)
    }

    // Disable the type issue until I get around to fixing this whole endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existingDraft as any).commissioner !== userId) {
      return apiError("Unauthorized", 403)
    }

    const draft = await prisma.draft.update({
      where: { id },
      data: { name: trimmedName } as Prisma.DraftUncheckedUpdateInput,
    })

    return apiSuccess(draft)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE - Delete a draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError("Unauthorized", 401)
    }

    const id = params.id

    if (!id) {
      return apiError("id is required", 400)
    }

    // First check if draft exists and belongs to user
    const existingDraft = await prisma.draft.findUnique({
      where: { id },
    })

    if (!existingDraft) {
      return apiError("Draft not found", 404)
    }

    // Disable the type issue until I get around to fixing this whole endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existingDraft as any).commissioner !== userId) {
      return apiError("Unauthorized", 403)
    }

    await prisma.draft.delete({
      where: { id },
    })

    return apiSuccess({ message: "Draft deleted successfully" })
  } catch (error) {
    return handlePrismaError(error)
  }
}
