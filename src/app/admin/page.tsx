import Link from 'next/link'

export default function Admin() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Admin
      </h1>
      <p>

      </p>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
    </div>     
  )
}
