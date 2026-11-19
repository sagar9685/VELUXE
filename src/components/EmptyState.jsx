import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function EmptyState({ icon: Icon = SearchX, title, description, actionLabel, onAction, actionTo }) {
  const actionClass = 'btn-primary';
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-forest/20 bg-white/60 px-8 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold-dark">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-2xl">{title}</h3>
      {description && <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={`${actionClass} mt-8`}>
          {actionLabel}
        </button>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className={`${actionClass} mt-8`}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
