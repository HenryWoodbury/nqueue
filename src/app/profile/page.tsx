import Link from 'next/link'

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Profile
      </h1>
      <p>
        User profile
      </p>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
    </div>     
  )
}
