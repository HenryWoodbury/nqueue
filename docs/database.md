# Database Notes

## Integrating Clerk

```
// League Table
model League {
  id            String   @id @default(cuid())
  name          String
  // The unique ID from Clerk Organizations (Source of Truth for RBAC)
  clerkOrgId    String   @unique 
  commissioner  String   // Clerk User ID (for initial creator tracking)
  description   String? // League-specific description
  // One League has many Drafts
  drafts        Draft[]  @relation("LeagueToDrafts")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("leagues")
  @@index([clerkOrgId])
  @@index([commissioner])
}

// 2. The Draft Specific Table (Links back to its parent League)
model Draft {
  id           String     @id @default(cuid()) // Draft has its own ID
  description  String?    // Unique to Draft
  // The foreign key linking this draft back to its League ID
  leagueId     String?
  parentLeague League?    @relation("LeagueToDrafts", fields: [leagueId], references: [id])
  status       String     @default("draft") // e.g., "draft", "published", "active", etc.

  @@map("drafts")
}```

* At Request Time (JWT): Use the auth() or getAuth() helpers from the Clerk Next.js SDK. These provide the user's current orgRole (e.g., org:admin or org:member) directly from the session.
* Middleware: Protect routes using Clerk's orgResolver. If a user tries to access a League, Clerk verifies they belong to that organizationId before the code even reaches your Prisma query.
* Data Filtering: Use the clerkOrgId from the session to filter Prisma results:

```
const { orgId } = auth();
const myLeague = await prisma.league.findFirst({
  where: { base: { clerkOrgId: orgId } },
  include: { base: true, drafts: true }
});
```

## Implementation

Create the Clerk Organization first, then use its ID to create your database records within an atomic Prisma transaction.

The Implementation Logic

* Auth Check: Ensure the user is logged in using auth().
* Clerk Creation: Use the clerkClient to create the Organization. This makes the user the initial "Admin" (Commissioner).
* Prisma Transaction: Use prisma.$transaction to create the League. Can determine if creating Draft is transational.

Create League

```
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // 1. Get current user's ID
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { name, description } = await req.json();

    // 2. Create Organization in Clerk
    // This handles the RBAC (Commissioner/Managers) logic externally
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name,
      createdBy: userId, // User is automatically the "Admin" (Commissioner)
    });

    // 3. Create the League record in Prisma
    // We link it to the clerkOrgId so we can always find it via auth().orgId
    const newLeague = await prisma.league.create({
      data: {
        name,
        description,
        clerkOrgId: organization.id,
        commissioner: userId,
      },
    });

    return NextResponse.json(newLeague, { status: 201 });

  } catch (error) {
    console.error("League Creation Error:", error);
    
    // Pro-tip: If Clerk succeeds but Prisma fails, you might want to delete 
    // the Clerk org here to prevent orphaned organizations, though 
    // usually you would handle this with a background reconciliation script.
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

Get Leagues

```
// app/api/leagues/route.ts

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // Get all organizations the user belongs to from Clerk
  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId,
  });

  // Extract the organization IDs to query our database with
  const orgIds = memberships.data.map((m) => m.organization.id);

  // Use the extracted IDs to find the corresponding league records in Prisma
  const leagues = await prisma.league.findMany({
    where: {
      clerkOrgId: {
        in: orgIds,
      },
    },
    include: { drafts: true }, // Include drafts right here if needed
  });

  return NextResponse.json(leagues);
}

// app/api/leagues/[orgId]/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { orgId: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const league = await prisma.league.findUnique({
    where: {
      clerkOrgId: params.orgId,
    },
    // Include drafts and use 'join' strategy for single efficient query
    include: { 
      drafts: true,
    },
  });

  // You should add an authorization check here to ensure the user is 
  // actually a member of this Clerk organization before returning data.

  if (!league) {
    return new NextResponse("League not found", { status: 404 });
  }

  return NextResponse.json(league);
}

// app/api/drafts/by-user/route.ts

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // 1. Find all organizations the user belongs to
  const memberships = await clerkClient.users.getOrganizationMembershipList({ userId });
  const orgIds = memberships.data.map((m) => m.organization.id);

  // 2. Find all leagues associated with those organizations
  const leagues = await prisma.league.findMany({
    where: { clerkOrgId: { in: orgIds } },
    select: { id: true }, // Only need the DB league IDs
  });
  const leagueDbIds = leagues.map(l => l.id);

  // 3. Find all drafts belonging to those DB league IDs
  const allDrafts = await prisma.draft.findMany({
    where: {
      leagueId: {
        in: leagueDbIds,
      },
    },
    // Optionally include the league name in the result
    include: { parentLeague: { select: { name: true, clerkOrgId: true } } } 
  });

  return NextResponse.json(allDrafts);
}

// app/api/leagues/[leagueId]/drafts/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { leagueId: string } }
) {
  const { userId, orgId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  // Read the optional 'status' query parameter
  const status = url.searchParams.get("status"); 

  const drafts = await prisma.draft.findMany({
    where: {
      leagueId: params.leagueId,
      // Apply status filter if it exists
      status: status ? status : undefined, 
    },
    include: { parentLeague: { select: { clerkOrgId: true } } }
  });

  // Crucial: Check that the user belongs to the correct organization
  if (drafts.length > 0 && drafts[0].parentLeague?.clerkOrgId !== orgId) {
     return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.json(drafts);
}

// app/api/drafts/[draftId]/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { draftId: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const draft = await prisma.draft.findUnique({
    where: {
      id: params.draftId,
    },
    include: { parentLeague: { select: { clerkOrgId: true } } },
  });

  if (!draft) return new NextResponse("Draft not found", { status: 404 });

  // In a real application, you must verify here that the user 
  // has permission via Clerk to view this specific draft.

  return NextResponse.json(draft);
}

### Delete

Need further research on how changes in the Clerk dashboard get picked up by the application. A Clerk Webhook can be added to the application
to clean up orphaned records.

How are leagues and drafts deleted? A hard delete means any league deletion should roll up all the drafts. What about soft deletion?

How are user deletions handled? What is retained in the database and presented in a draft?
