import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Home Page
      </h1>
      <p>
        <Link href={`/draft`}>Draft Room</Link>
      </p>
    </div>
  );
}
