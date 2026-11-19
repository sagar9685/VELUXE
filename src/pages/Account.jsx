import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Handshake, Heart, LogOut, MessageCircle, Settings, UserRound, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useMarketplace } from '../context/MarketplaceContext';
import { buyerProfile } from '../data/account';
import { formatDate, formatPrice, timeAgo } from '../lib/format';
import { initialsOf } from '../data/sellers';

const TABS = [
  { id: 'overview', label: 'Overview', icon: UserRound },
  { id: 'saved', label: 'Saved listings', icon: Heart },
  { id: 'inquiries', label: 'Inquiries & offers', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Account settings', icon: Settings },
];

export default function Account() {
  const [tab, setTab] = useState('overview');
  const { user, favorites, products, offers, inquiries, notifications, unreadCount } = useMarketplace();
  const savedCount = favorites.length;

  return (
    <div className="mx-auto max-w-[1300px] px-6 pb-28 pt-14 lg:px-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">Welcome back, {user.name.split(' ')[0]}</h1>
        </div>
        <Link to="/explore" className="btn-ghost self-start sm:self-auto">
          Browse the marketplace
        </Link>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Side navigation */}
        <nav aria-label="Account sections" className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const badge = t.id === 'notifications' ? unreadCount : 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-sm transition-all duration-300 ${
                  active ? 'bg-forest text-ivory shadow-soft' : 'text-forest/75 hover:bg-white hover:text-forest'
                }`}
              >
                <Icon size={16} className={active ? 'text-gold' : ''} aria-hidden="true" />
                {t.label}
                {badge > 0 && (
                  <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-charcoal">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {tab === 'overview' && (
                <Overview user={user} savedCount={savedCount} offersCount={offers.length} inquiriesCount={inquiries.length} unread={unreadCount} onNavigate={setTab} />
              )}
              {tab === 'saved' && <SavedTab favorites={favorites} products={products} />}
              {tab === 'inquiries' && <InquiriesTab inquiries={inquiries} offers={offers} />}
              {tab === 'notifications' && <NotificationsTab />}
              {tab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Overview */

function Overview({ user, savedCount, offersCount, inquiriesCount, unread, onNavigate }) {
  const stats = [
    { label: 'Saved listings', value: savedCount, action: () => onNavigate('saved') },
    { label: 'Offers sent', value: offersCount, action: () => onNavigate('inquiries') },
    { label: 'Inquiries', value: inquiriesCount, action: () => onNavigate('inquiries') },
    { label: 'Unread notifications', value: unread, action: () => onNavigate('notifications') },
  ];
  return (
    <div className="space-y-10">
      <div className="grid gap-8 rounded-3xl bg-forest p-8 text-ivory md:grid-cols-[auto_1fr] md:items-center md:p-10">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-gold/15 font-serif text-3xl text-gold ring-1 ring-gold/40">
          {initialsOf(user.name)}
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-serif text-3xl">{user.name}</p>
            <p className="mt-1 text-xs text-ivory/60">{user.email}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Location</p>
            <p className="mt-1 text-sm">{user.location}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Member since</p>
            <p className="mt-1 text-sm">{formatDate(user.memberSince)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <button key={s.label} type="button" onClick={s.action} className="card-lux p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
            <p className="font-serif text-4xl text-forest">{s.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="card-lux p-8">
        <h2 className="text-2xl">Recent activity</h2>
        <ActivityList />
      </div>
    </div>
  );
}

function ActivityList() {
  const { notifications } = useMarketplace();
  const recent = notifications.slice(0, 4);
  if (!recent.length) return <p className="mt-6 text-sm text-muted">No recent activity.</p>;
  return (
    <ul className="mt-6 divide-y divide-forest/10">
      {recent.map((n) => (
        <li key={n.id} className="flex items-start justify-between gap-6 py-4">
          <div>
            <p className="text-sm font-medium text-forest">{n.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{n.body}</p>
          </div>
          <span className="shrink-0 text-[11px] text-muted">{timeAgo(n.time)}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------- Saved */

function SavedTab({ favorites, products }) {
  const saved = favorites.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  if (!saved.length) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved listings yet"
        description="Save pieces you love and they will appear here, ready to revisit."
        actionLabel="Explore listings"
        actionTo="/explore"
      />
    );
  }
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {saved.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------- Inquiries & offers */

function InquiriesTab({ inquiries, offers }) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl">Recent inquiries</h2>
        <p className="mt-1 text-xs text-muted">Messages you have sent to sellers. Sample replies are illustrative.</p>
        {inquiries.length === 0 ? (
          <p className="mt-6 text-sm text-muted">You have not contacted any sellers yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-forest/10 rounded-3xl bg-white ring-1 ring-forest/5">
            {inquiries.map((i) => (
              <li key={i.id} className="grid gap-3 p-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="min-w-0">
                  <Link to={`/product/${i.productId}`} className="font-serif text-lg text-forest transition hover:text-gold-dark">
                    {i.productTitle}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    To {i.sellerName} · {timeAgo(i.createdAt)}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-forest/75">{i.message}</p>
                </div>
                <StatusPill status={i.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl">Offers</h2>
        {offers.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No offers yet. Use “Make an Offer” on any listing.</p>
        ) : (
          <ul className="mt-6 divide-y divide-forest/10 rounded-3xl bg-white ring-1 ring-forest/5">
            {offers.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-dark">
                    <Handshake size={16} />
                  </span>
                  <div>
                    <Link to={`/product/${o.productId}`} className="font-serif text-lg text-forest transition hover:text-gold-dark">
                      {o.productTitle}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      Asking {formatPrice(o.askingPrice)} · {timeAgo(o.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif text-xl text-forest">{formatPrice(o.amount)}</span>
                  <StatusPill status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }) {
  const tone =
    status === 'Replied' || status === 'Countered'
      ? 'bg-gold/15 text-gold-dark ring-gold/40'
      : status === 'Sent' || status === 'Awaiting reply'
        ? 'bg-forest/5 text-forest ring-forest/10'
        : 'bg-stone-100 text-charcoal ring-forest/10';
  return <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${tone}`}>{status}</span>;
}

/* -------------------------------------------------------- Notifications */

function NotificationsTab() {
  const { notifications, markAllRead, markRead, dismissNotification, unreadCount } = useMarketplace();
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl">Notifications</h2>
          <p className="mt-1 text-xs text-muted">{unreadCount} unread</p>
        </div>
        <button type="button" onClick={markAllRead} disabled={!unreadCount} className="btn-ghost !py-2.5 !text-xs disabled:opacity-40">
          Mark all as read
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Bell} title="All caught up" description="New offers, replies and drop announcements will appear here." />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-forest/10 rounded-3xl bg-white ring-1 ring-forest/5">
          {notifications.map((n) => (
            <li key={n.id} className={`group relative flex gap-4 p-6 ${n.read ? '' : 'bg-gold/5'}`}>
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-gold'}`} aria-hidden="true" />
              <button type="button" onClick={() => markRead(n.id)} className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium text-forest">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted/80">{timeAgo(n.time)}</p>
              </button>
              <button type="button" onClick={() => dismissNotification(n.id)} aria-label="Dismiss" className="self-start rounded-full p-1.5 text-muted opacity-0 transition hover:text-forest group-hover:opacity-100 focus:opacity-100">
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Settings */

const PREF_LABELS = {
  offers: 'Offer updates',
  inquiries: 'Seller replies',
  priceDrops: 'Price drops on saved listings',
  dropsAndAuctions: 'Drops and auction reminders',
  newsletter: 'The private letter newsletter',
};

function SettingsTab() {
  const { user, updateUser, showToast } = useMarketplace();
  const [form, setForm] = useState({ name: user.name, email: user.email, location: user.location });
  const [prefs, setPrefs] = useState(buyerProfile.notificationPrefs);
  const [error, setError] = useState('');

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.');
    setError('');
    updateUser({ ...form, name: form.name.trim() });
  };

  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <form onSubmit={save} className="card-lux space-y-6 p-8" noValidate>
        <h2 className="text-2xl">Profile</h2>
        <div>
          <label htmlFor="acc-name" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-forest/70">Full name</label>
          <input id="acc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-lux" />
        </div>
        <div>
          <label htmlFor="acc-email" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-forest/70">Email</label>
          <input id="acc-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-lux" />
        </div>
        <div>
          <label htmlFor="acc-loc" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-forest/70">City</label>
          <input id="acc-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-lux" />
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
        <button type="submit" className="btn-primary">Save profile</button>
      </form>

      <div className="space-y-10">
        <div className="card-lux space-y-5 p-8">
          <h2 className="text-2xl">Notifications</h2>
          {Object.entries(PREF_LABELS).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 text-sm text-forest/85">
              {label}
              <input type="checkbox" role="switch" checked={prefs[key]} onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })} className="peer sr-only" />
              <span aria-hidden="true" className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 ${prefs[key] ? 'bg-forest' : 'bg-forest/20'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-transform duration-300 ${prefs[key] ? 'translate-x-[22px] bg-gold' : 'translate-x-0.5'}`} />
              </span>
            </label>
          ))}
          <button type="button" onClick={() => showToast('Notification preferences saved')} className="btn-ghost !py-2.5 !text-xs">
            Save preferences
          </button>
        </div>

        <div className="card-lux p-8">
          <h2 className="text-2xl">Session</h2>
          <p className="mt-2 text-sm text-muted">This prototype has no sign-in. Signing out only resets the message below.</p>
          <button type="button" onClick={() => showToast('Signed out (demo)', 'info')} className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest/15 px-5 py-2.5 text-sm text-forest transition hover:border-red-300 hover:text-red-700">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
