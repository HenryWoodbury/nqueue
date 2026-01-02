'use client'

import Link from 'next/link'

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"

import { LeaguesList } from '@/components/Leagues'
import { Button } from '@/components/ui/button'
export default function Page() {
  const { user } = useUser()

  return (
    <div className="px-6 py-4">
      <SignedIn>
        <>
          <h1 className="text-xl">
            Hello {user?.username}!
          </h1>

          <LeaguesList />
          <p>
            <Link href={`/league/create`}>Create a New League</Link>
          </p> 
        </>
      </SignedIn>
      <SignedOut>
        <>
          <p>Welcome to Draft Canvas.</p>

          <SignInButton mode="modal">
            <Button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50">
                Sign in or Sign up
            </Button>
          </SignInButton>
        </>
      </SignedOut>
      <p>
        <Link href={`/draft`}>Public Drafts</Link>
      </p>
    </div>
  )
}
