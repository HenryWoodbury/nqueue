'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {useGetDraft} from '@/hooks/useFetcher'
import { LoadingSkeleton } from '@/components/Loading'

export default function Page() {
  const params = useParams()
  const id = params.id ?? ''
  // TODO -- Don't look for Draft if id is undefined
  const { draft, isLoading, error } = useGetDraft(id as string)
  if (isLoading) return (
    <LoadingSkeleton />
  )
  if (error) return (
    <>
      <p>Error</p>
      <p>{error.message}</p>
    </>
  )
  if (!draft) return (
    <>
      <p>Draft not found</p>
      <p>Draft {id} not found</p>
    </>
  )
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Draft Page
      </h1>
      <p>Page for {draft.draftName}</p>
      <p>
        <Link href={`/`}>Home</Link>
      </p>
    </div>
  )
}
