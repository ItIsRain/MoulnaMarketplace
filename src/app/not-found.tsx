import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <h1 className="text-6xl font-display font-bold text-moulna-gold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-moulna-charcoal text-white rounded-lg hover:bg-moulna-charcoal-light transition-colors text-sm font-medium"
      >
        Go Home
      </Link>
    </div>
  );
}
