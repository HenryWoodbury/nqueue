

import Link from 'next/link'
import { Suspense } from 'react'

/*

The underscore in front of _loading.tsx removes it's default functionality.

As loading.tsx it creates an automatic suspense boundary. When you create a loading.tsx file within a route 
segment, Next.js automatically wraps that segment's content (e.g., page.tsx) in a React Suspense boundary.
The component exported from loading.tsx serves as the fallback UI that Next.js displays while the data for 
the corresponding page.tsx (or other server components within that segment) is being fetched on the server.

*/

import { LoadingSkeleton } from '@/components/Loading'

// Simulate a slow data fetching function
async function getSlowData() {
  await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
  return { message: "Well this took a while!" }
}

const SlowDown = async () => {
  const msg = await getSlowData()
  return (
    <>
      <p>
        {msg.message}
      </p>
    </>
  )

}

export default function Page() {

  return (
    <div className="p-4">
      <h1 className="text-xl">
        Draft Room
      </h1>
      <p>
        Should Draft Room be a dynamic route? Or should it be a dynamically rendered
        page (always the same URL, always the most recent draft for this manager).
      </p>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowDown />
      </Suspense>
    </div>     
  )
}
