import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Gavel, Handshake, MessageCircle, Sparkles, Tag, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { timeAgo } from '../lib/format';

const ICONS = {
  auction: Gavel,
  price: Tag,
  inquiry: MessageCircle,
  offer: Handshake,
  drop: Sparkles,
  listing: Bell,
};

export default function NotificationCenter({ onNavigate }) {
  const { notifications, markAllRead, markRead, dismissNotification, unreadCount } = useMarketplace();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-3 w-[min(92vw,380px)] origin-top-right overflow-hidden rounded-2xl bg-ivory shadow-soft ring-1 ring-forest/10"
    >
      <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
        <div>
          <p className="font-serif text-lg text-forest">Notifications</p>
          <p className="text-[11px] text-muted">{unreadCount} unread</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="text-xs font-medium text-gold-dark transition hover:text-forest disabled:opacity-40"
        >
          Mark all as read
        </button>
      </div>

      <ul className="max-h-[420px] divide-y divide-forest/5 overflow-y-auto">
        {notifications.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted">You are all caught up.</li>
        )}
        {notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <li key={n.id} className={`group relative flex gap-4 px-5 py-4 transition ${n.read ? '' : 'bg-gold/5'}`}>
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-gold">
                <Icon size={15} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="block w-full text-left"
                >
                  <p className="text-sm font-medium text-charcoal">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{n.body}</p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-muted/80">{timeAgo(n.time)}</p>
                </button>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissNotification(n.id)}
                className="absolute right-3 top-3 rounded-full p-1 text-muted opacity-0 transition hover:text-forest group-hover:opacity-100 focus:opacity-100"
              >
                <X size={14} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-forest/10 px-5 py-3 text-center">
        <Link
          to="/account"
          onClick={onNavigate}
          className="text-xs font-medium uppercase tracking-[0.18em] text-forest transition hover:text-gold-dark"
        >
          View all in your account
        </Link>
      </div>
    </motion.div>
  );
}
