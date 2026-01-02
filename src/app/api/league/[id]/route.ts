import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

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

    const league = await prisma.league.findUnique({
      where: { id },
    })

    if (!league) {
      return apiError("League not found", 404)
    }

    // TODO Confirm Managers in league

    /*
    if ((league as any).commissioner !== userId) {
      return apiError('Unauthorized', 403)
    }
*/
    return apiSuccess(league)
  } catch (error) {
    return handlePrismaError(error)
  }
}
