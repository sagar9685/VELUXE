import { Timer } from 'lucide-react';
import useNow from '../lib/useNow';
import { formatCountdown } from '../lib/format';

export default function AuctionCountdown({ endsAt, className = '' }) {
  const now = useNow();
  const remaining = new Date(endsAt).getTime() - now;
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-sm tabular-nums text-forest ${className}`}>
      <Timer size={15} className="text-gold-dark" aria-hidden="true" />
      {formatCountdown(remaining)}
    </span>
  );
}
