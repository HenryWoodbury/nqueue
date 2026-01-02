'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {useGetLeague} from '@/hooks/useFetcher'
import { LoadingSkeleton } from '@/components/Loading'

export default function Page() {
  const params = useParams()
  const id = params.id ?? ''
  // TODO -- Don't look for League if id is undefined
  const { league, isLoading, error } = useGetLeague(id as string)
  if (isLoading) return (
    <LoadingSkeleton />
  )
  if (error) return (
    <>
      <p>Error</p>
      <p>{error.message}</p>
    </>
  )
  if (!league) return (
    <>
      <p>League not found</p>
      <p>League {id} not found</p>
    </>
  )
  return (
    <div className="p-4">
      <h1 className="text-xl">
        League Page
      </h1>
      <p>Page for {league.name}</p>
      <p>
        <Link href={`/`}>Home</Link>
      </p>
    </div>
  )
}
