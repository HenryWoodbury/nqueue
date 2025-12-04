'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs"

import { Button } from '@/components/ui/button'

export default function Page() {
  const router = useRouter()
  const [draftName, setDraftName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ draftName }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || 'Failed to create draft')
      }

      const newItem = await response.json()
      router.push(`/drafts/${newItem.id}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create draft. Please try again.'
      console.error('Failed to create draft:', error)
      // TODO: Replace with toast notification system
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl">
        Create New Draft
      </h1>

      <p>Hello {user.username}!</p>

      <form onSubmit={handleSubmit}>
        <label>
          <span className="block p-1">Custom name</span>
          <span className="block p-1">
            <input
              className="border rounded-[4px] px-2 py-1"
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              required
            />
          </span>
        </label>
        <span className="block p-1">
          <Button 
            variant="outline"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </span>
      </form>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
    </div>     
  )
}
