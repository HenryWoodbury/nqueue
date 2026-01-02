import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

import { apiError } from '@/lib/api-helpers'

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const clerk = await clerkClient();

  const memberships = await clerk.users.getOrganizationMembershipList({
    userId,
  });

  // Extract the organization IDs to query the database
  const orgIds = memberships.data.map((m) => m.organization.id);

  // Use the extracted IDs to find the corresponding league records in Prisma
  const leagues = await prisma.league.findMany({
    where: {
      clerkOrgId: {
        in: orgIds,
      },
    },
    include: { drafts: true },
  });

  return NextResponse.json(leagues);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json()
    const { name, description } = body

    if (!name || typeof name !== 'string') {
      return apiError('A league name is required and must be a string', 400)
    }

    // Trim and validate length
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName || typeof trimmedName !== 'string') {
      return apiError('A league name is required and must be a string', 400)
    }

    if (trimmedName.length > 255) {
      return apiError('League Name must be 255 characters or less', 400)
    }

    // Create Organization in Clerk. Clerk handles RBAC (Commissioner/Managers)
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name,
      createdBy: userId, // User is automatically the "Admin" (Commissioner)
    });

    const newLeague = await prisma.league.create({
      data: {
        name,
        description: trimmedDescription || null,
        clerkOrgId: organization.id,
        commissioner: userId,
      },
    });

    return NextResponse.json(newLeague, { status: 201 });

  } catch (error) {
    console.error("League Creation Error:", error);    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// If Clerk succeeds but Prisma fails, you might want to delete 
// the Clerk org here to prevent orphaned organizations, though 
// usually you would handle this with a background reconciliation script.

