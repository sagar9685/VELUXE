import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import EmptyState from '../components/EmptyState';
import { AuthenticityBadge } from '../components/Badges';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice } from '../lib/format';
import { sellerById } from '../data/sellers';

export default function Wishlist() {
  const { favorites, products, removeFavorite, showToast } = useMarketplace();
  const saved = favorites.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  const remove = (id, title) => {
    removeFavorite(id);
    showToast(`Removed ${title}`, 'info');
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-28 pt-14 lg:px-10">
      <header className="flex flex-col justify-between gap-6 border-b border-forest/10 pb-10 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Your wishlist</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">Saved pieces</h1>
          <p className="mt-4 text-sm text-muted">
            {saved.length} {saved.length === 1 ? 'piece' : 'pieces'} saved on this device.
          </p>
        </div>
        {saved.length > 0 && (
          <Link to="/explore" className="btn-ghost self-start sm:self-auto">
            Continue exploring <ArrowRight size={15} />
          </Link>
        )}
      </header>

      {saved.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart on any listing to keep it here. Saved pieces stay on this device."
            actionLabel="Explore the marketplace"
            actionTo="/explore"
          />
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-forest/10">
          <AnimatePresence initial={false}>
            {saved.map((p) => {
              const seller = sellerById(p.sellerId);
              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-6 overflow-hidden py-8 sm:grid-cols-[200px_1fr] sm:items-center"
                >
                  <Link to={`/product/${p.id}`} className="group block aspect-[4/3] overflow-hidden rounded-2xl bg-forest/5 sm:aspect-square">
                    <ImageWithFallback src={p.images[0]} alt={p.title} label={p.brand} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </Link>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="eyebrow">{p.brand}</p>
                      <Link to={`/product/${p.id}`}>
                        <h2 className="mt-2 text-2xl transition hover:text-gold-dark">{p.title}</h2>
                      </Link>
                      <p className="mt-2 text-xs text-muted">
                        {p.location} · {p.condition} · {seller?.studio}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <AuthenticityBadge status={p.authenticity} />
                        <span className="font-serif text-xl text-forest">{formatPrice(p.isAuction ? p.startingBid : p.price)}</span>
                        {p.isAuction && <span className="text-xs text-muted">starting bid</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <Link to={`/product/${p.id}`} className="btn-ghost !py-2.5 !text-xs">
                        View details
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(p.id, p.title)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-muted transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
