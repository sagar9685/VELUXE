import { Info } from 'lucide-react';
import { SITE } from '../config/site';

/** Labels pages that display demonstration data. */
export default function SampleNotice({ className = '' }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-3.5 text-xs leading-relaxed text-forest/80 ${className}`}>
      <Info size={15} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />
      <span>{SITE.demoNotice}</span>
    </div>
  );
}
