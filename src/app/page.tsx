import Link from 'next/link'

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Home Page
      </h1>
      <p>Get users profile and list any drafts.</p>
      <p>
        <Link href={`/create`}>Create Draft</Link>
      </p>     
      <p>
        <Link href={`/draft`}>Draft Room</Link>
      </p>
    </div>
  )
}
