import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x py-24 text-center">
      <p className="font-mono text-7xl font-semibold text-jett-600 sm:text-9xl">404</p>
      <h1 className="mt-4 text-4xl tracking-tight">This trip isn&apos;t on the board.</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">
        It may have been retired or renamed. Have a look at what&apos;s running now.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/category/mpt" className="btn-ghost">Popular tours</Link>
      </div>
    </main>
  );
}
