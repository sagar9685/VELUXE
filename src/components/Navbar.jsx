import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Heart, Menu, Search, User, X } from 'lucide-react';
import Logo from './Logo';
import NotificationCenter from './NotificationCenter';
import { useMarketplace } from '../context/MarketplaceContext';

const links = [
  { to: '/explore', label: 'Explore' },
  { to: '/collections', label: 'Collections' },
  { to: '/explore?auction=1', label: 'Auctions', match: (p, s) => p === '/explore' && s.includes('auction=1') },
  { to: '/dashboard/seller', label: 'Seller Studio' },
];

export default function Navbar() {
  const { favorites, unreadCount } = useMarketplace();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  // Close transient UI on route change.
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname, location.search]);

  // Close notifications when clicking outside.
  useEffect(() => {
    if (!notifOpen) return undefined;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-ivory/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-5 lg:px-10">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => {
                const active = l.match ? l.match(location.pathname, location.search) : isActive && !l.to.includes('?');
                return `relative py-2 text-[13px] tracking-wide transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-500 hover:text-gold-dark hover:after:w-full ${
                  active ? 'text-forest after:w-full' : 'text-forest/75 after:w-0'
                }`;
              }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form onSubmit={submitSearch} className="hidden items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-2 transition focus-within:border-gold xl:flex">
            <Search size={15} className="text-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Brand, product or city"
              aria-label="Search the marketplace"
              className="w-44 bg-transparent text-sm placeholder:text-muted focus:outline-none"
            />
          </form>

          <Link
            to="/explore"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5 xl:hidden"
          >
            <Search size={19} />
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${favorites.length} saved`}
            className="relative hidden h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5 sm:grid"
          >
            <Heart size={19} />
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-semibold text-charcoal">
                {favorites.length}
              </span>
            )}
          </Link>

          <div ref={notifRef} className="relative">
            <button
              type="button"
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((o) => !o)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold ring-2 ring-ivory" />
              )}
            </button>
            <AnimatePresence>
              {notifOpen && <NotificationCenter onNavigate={() => setNotifOpen(false)} />}
            </AnimatePresence>
          </div>

          <Link
            to="/account"
            aria-label="Your account"
            className="hidden h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5 md:grid"
          >
            <User size={19} />
          </Link>

          <Link
            to="/sell"
            className="btn-primary hidden !px-5 !py-2.5 text-xs sm:inline-flex"
          >
            Sell Your Item
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5 lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-40 h-[calc(100vh-5rem)] overflow-y-auto bg-ivory px-6 pb-10 pt-8 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {[...links, { to: '/wishlist', label: `Wishlist (${favorites.length})` }, { to: '/account', label: 'Account' }].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="border-b border-forest/10 py-4 font-serif text-2xl text-forest transition hover:text-gold-dark"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <form onSubmit={submitSearch} className="mt-8 flex items-center gap-3 rounded-full border border-forest/15 bg-white px-5 py-3">
              <Search size={16} className="text-muted" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands, products, cities"
                aria-label="Search the marketplace"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </form>
            <Link to="/sell" className="btn-primary mt-8 w-full">
              Sell Your Item
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
