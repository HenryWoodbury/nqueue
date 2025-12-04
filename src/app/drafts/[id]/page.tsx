'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {useGetDrafts} from '@/hooks/useFetcher'
import { LoadingSkeleton } from '@/components/Loading'

export default function Page() {
  const params = useParams()
  const id = params.id ?? ''
  const { drafts, isLoading, isError } = useGetDrafts(id as string)
  if (isLoading) return (
    <LoadingSkeleton />
  )
  if (isError) return (
    <>
      <p>Error</p>
      <p>{isError.errorMessage}</p>
    </>
  )

  return (
    <div className="p-4">
      <h1 className="text-xl">
        Draft Page
      </h1>
      <p>Page for {drafts.draftName}</p>
      <p>
        <Link href={`/`}>Home</Link>
      </p>
    </div>
  )
}
