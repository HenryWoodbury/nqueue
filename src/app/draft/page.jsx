import Link from 'next/link';

export default function Draft() {
  return (
    <div className="p-4">
      <h1 className="text-xl">
        Draft Room
      </h1>
      <p>
        Should Draft Room be a dynamic route? Or should it be a dynamically rendered
        page (always the same URL, always the "most recent" draft for this manager).
      </p>
      <p>
        Back to <Link href={`/`}>Home</Link>.
      </p>
    </div>     
  );
}
