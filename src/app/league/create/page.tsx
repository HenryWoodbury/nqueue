'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const router = useRouter()
  const [leagueName, setLeagueName] = useState('')
  const [leagueDescription, setLeagueDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isSignedIn, isLoaded } = useUser()

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
      const response = await fetch('/api/league', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: leagueName, description: leagueDescription }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || 'Failed to create league')
      }

      const newItem = await response.json()
      router.push(`/league/${newItem.id}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create league. Please try again.'
      console.error('Failed to create league:', error)
      // TODO: Replace with toast notification system
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

// Create a Combobox with text entry for league name -- see https://ui.shadcn.com/docs/components/combobox
// The create will either provide a league ID that can be plugged straight into the Draft POST
// or a league name that requires creating the league to get back the ID.
// If that failed could we still provisionally create the draft with the entered league name?

  return (
    <div className="p-4">
      <h1 className="text-xl">
        Create New League
      </h1>

      <form onSubmit={handleSubmit}>
        <FieldLabel htmlFor="leagueName">League</FieldLabel>
        <Field>
          <Input
            id="leagueName"
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            required
          />
        </Field>
        <FieldLabel htmlFor="leagueDescription">Description</FieldLabel>
        <Field>
          <Input
            id="leagueDescription"
            type="text"
            value={leagueDescription}
            onChange={(e) => setLeagueDescription(e.target.value)}
            required
          />
        </Field>
        <Button 
          variant="outline"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </form>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
    </div>     
  )
}
