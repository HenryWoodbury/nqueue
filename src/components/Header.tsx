'use client'

import Link from 'next/link'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'

const Header = () => {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role || 'none'
  const isAdmin = userRole === 'admin'

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Draft Canvas
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <SignedIn>
                { isAdmin ?
                  <li>
                    <Link href="/admin"
                      // className={!isAdmin ? 'pointer-events-none text-neutral-400' : ''} 
                      // aria-disabled={!isAdmin} aria-label="Admin"
                      // tabIndex={!isAdmin ? -1 : undefined}
                    >Admin</Link>
                  </li>
                  : null }
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </SignedIn>
              <SignedIn>
                <li className="flex items-center">
                  <UserButton />
                </li>
              </SignedIn>
              <SignedOut>
                <li className="flex items-center outline">
                  <SignInButton mode="modal" />
                </li>                
              </SignedOut>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header