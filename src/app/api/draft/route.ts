import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

import { apiError, apiSuccess, handlePrismaError } from "@/lib/api-helpers"
import type { CreateDraftRequest } from "@/types/api"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError("Unauthorized", 401)
    }

    // Find drafts where the user is either the creator OR a member
    // Disable the type issue until I get around to fixing this whole endpoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drafts = await (prisma.draft.findMany as any)({
      where: {
        OR: [{ commissioner: userId }, { managers: { has: userId } }],
      },
      /*
      select: {
        // list all the draft fields I want with "true", i.e.
        id: true,
        name: true,
        description: true,
        leagueId: true,
        createdAt: true,
        league: {
          select: {
            name: true
          }
        }
      },
      relationLoadStrategy: 'join',
      */
      orderBy: { createdAt: "desc" },
    })

    return apiSuccess(drafts)
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return apiError("Unauthorized", 401)
    }

    const body: CreateDraftRequest = await request.json()
    const { draftName, leagueName } = body

    // Validate input
    if (!draftName || typeof draftName !== "string") {
      return apiError("draftName is required and must be a string", 400)
    }

    // Trim and validate length
    const trimmedName = draftName.trim()
    if (trimmedName.length === 0) {
      return apiError("draftName cannot be empty", 400)
    }

    if (trimmedName.length > 255) {
      return apiError("draftName must be 255 characters or less", 400)
    }

    const draft = await prisma.draft.create({
      data: {
        name: trimmedName,
        leagueId: leagueName, // TODO
        commissioner: userId,
        // Disable the type issue until I get around to fixing this whole endpoint
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    return apiSuccess(draft, 201)
  } catch (error) {
    return handlePrismaError(error)
  }
}
