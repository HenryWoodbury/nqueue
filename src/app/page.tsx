import Link from 'next/link'

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

import { DraftsList } from '@/components/Drafts'

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Home Page
      </h1>
      <SignedIn>
        <>
          <DraftsList />
          <p>
            <Link href={`/create`}>Create a New Draft</Link>
          </p> 
        </>
      </SignedIn>
      <SignedOut>
        <>
          <p>Welcome to Draft Canvas. Create an account and start drafting!</p>
          
          <SignInButton mode="modal" />
        </>
      </SignedOut>
      <p>
        <Link href={`/draft`}>Public Drafts</Link>
      </p>
    </div>
  )
}
