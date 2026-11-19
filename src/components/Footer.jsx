import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import Logo from './Logo';
import { SITE } from '../config/site';
import { useMarketplace } from '../context/MarketplaceContext';

const columns = [
  {
    title: 'Marketplace',
    items: [
      { label: 'Explore all', to: '/explore' },
      { label: 'Motorcycles', to: '/explore?category=motorcycles' },
      { label: 'Automobiles', to: '/explore?category=automobiles' },
      { label: 'Watches', to: '/explore?category=watches' },
      { label: 'Auctions', to: '/explore?auction=1' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { label: 'The Racing Heritage', to: '/collections' },
      { label: 'The Timepiece Vault', to: '/collections' },
      { label: 'The Open Road Edit', to: '/collections' },
      { label: 'The Maison Edit', to: '/collections' },
    ],
  },
  {
    title: 'Sellers',
    items: [
      { label: 'Start selling', to: '/sell' },
      { label: 'Seller studio', to: '/dashboard/seller' },
      { label: 'Authenticity standards', to: '/' },
      { label: 'Seller storefronts', to: '/explore?verified=1' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Your account', to: '/account' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Notifications', to: '/account' },
    ],
  },
];

export default function Footer() {
  const { showToast } = useMarketplace();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address', 'info');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the VELUXE letter (demo)');
  };

  return (
    <footer className="relative overflow-hidden bg-forest text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ivory/65">
              A curated home for premium automobiles, motorcycles, watches, fashion and collectibles — bought and sold with care.
            </p>
            <a href={`mailto:${SITE.contactEmail}`} className="mt-6 inline-block text-sm text-gold transition hover:text-gold-light">
              {SITE.contactEmail}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-5">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link to={item.to} className="text-sm text-ivory/70 transition hover:text-gold">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <p className="font-serif text-2xl leading-snug">The private letter</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/65">
              First access to drops, auctions and newly authenticated pieces.
            </p>
            {subscribed ? (
              <div className="mt-6 flex items-center gap-3 rounded-full border border-gold/40 px-5 py-3.5 text-sm text-gold">
                <Check size={16} /> You are on the list.
              </div>
            ) : (
              <form onSubmit={subscribe} className="mt-6 flex items-center rounded-full border border-ivory/20 bg-white/5 p-1.5 pl-5 transition focus-within:border-gold">
                <label htmlFor="newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
                />
                <button type="submit" aria-label="Subscribe" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-charcoal transition hover:bg-gold-light">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="hairline mt-16 opacity-40" />
        <div className="mt-8 flex flex-col gap-4 text-xs text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.</p>
          <p className="max-w-xl md:text-right">{SITE.demoNotice}</p>
        </div>
      </div>
    </footer>
  );
}
