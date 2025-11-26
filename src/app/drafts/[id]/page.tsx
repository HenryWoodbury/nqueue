'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams<{ id: string }>()
  const draftId = params.id
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Draft Page {draftId}
      </h1>
      <p>Page for {draftId}</p>
      <p>
        <Link href={`/`}>Home</Link>
      </p>
    </div>
  )
}
