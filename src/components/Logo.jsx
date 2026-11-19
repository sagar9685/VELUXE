import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

/** Wordmark driven by SITE config, so a rename requires no component changes. */
export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`group inline-flex flex-col items-start leading-none ${className}`} aria-label={`${SITE.name} home`}>
      <span
        className={`font-serif text-2xl tracking-[0.34em] transition-colors duration-500 group-hover:text-gold ${
          light ? 'text-ivory' : 'text-forest'
        }`}
      >
        {SITE.name}
      </span>
      <span className="mt-1.5 text-[8.5px] uppercase tracking-[0.42em] text-gold-dark">{SITE.tagline}</span>
    </Link>
  );
}
