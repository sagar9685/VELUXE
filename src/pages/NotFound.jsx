import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-8xl text-gold">404</p>
      <h1 className="mt-6 text-4xl">This page has taken a detour</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">The page you are looking for may have moved. Our collection remains open.</p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to="/" className="btn-primary">
          Return home
        </Link>
        <Link to="/explore" className="btn-ghost">
          Explore the marketplace
        </Link>
      </div>
    </div>
  );
}
