import { BadgeCheck, Clock, FileText } from 'lucide-react';

export function VerifiedBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-forest shadow-sm backdrop-blur ${className}`}
    >
      <BadgeCheck size={13} className="text-gold-dark" aria-hidden="true" />
      Verified
    </span>
  );
}

const AUTH = {
  verified: {
    label: 'Reviewed by VELUXE',
    note: 'Reviewed by the VELUXE Authenticity Desk (demo record).',
    icon: BadgeCheck,
    tone: 'text-forest bg-gold/15 ring-gold/40',
  },
  'seller-declared': {
    label: 'Seller-declared',
    note: 'Information provided by the seller. Not yet reviewed by VELUXE.',
    icon: FileText,
    tone: 'text-charcoal bg-stone-100 ring-forest/10',
  },
  pending: {
    label: 'Review pending',
    note: 'An authenticity review has been requested and is not yet complete.',
    icon: Clock,
    tone: 'text-charcoal bg-amber-50 ring-amber-200',
  },
};

export function authenticityFor(status) {
  return AUTH[status] || AUTH['seller-declared'];
}

export function AuthenticityBadge({ status, className = '' }) {
  const info = authenticityFor(status);
  const Icon = info.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ring-1 ${info.tone} ${className}`}
    >
      <Icon size={13} aria-hidden="true" />
      {info.label}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  return (
    <span className="inline-flex rounded-full border border-forest/15 px-2.5 py-1 text-[11px] font-medium text-forest/80">
      {condition}
    </span>
  );
}
