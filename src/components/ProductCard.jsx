import { Link } from 'react-router-dom';
import { Eye, MapPin, Scale } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import FavoriteButton from './FavoriteButton';
import { VerifiedBadge } from './Badges';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice } from '../lib/format';

export default function ProductCard({ product, showCompare = true, index = 0 }) {
  const { compare, toggleCompare, maxCompare } = useMarketplace();
  const inCompare = compare.includes(product.id);
  const compareFull = !inCompare && compare.length >= maxCompare;
  const cover = product.images?.[0];

  return (
    <article className="group flex flex-col" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest/5">
        <Link to={`/product/${product.id}`} className="block h-full w-full" aria-label={`View ${product.title}`}>
          <ImageWithFallback
            src={cover}
            alt={product.title}
            label={product.brand}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </Link>

        {product.verified && (
          <div className="pointer-events-none absolute left-4 top-4">
            <VerifiedBadge />
          </div>
        )}
        {product.isAuction && (
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-charcoal/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-gold backdrop-blur">
            Auction
          </span>
        )}
        <div className="absolute right-4 top-4 z-10">
          <FavoriteButton productId={product.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="mt-1.5">
          <h3 className="line-clamp-2 text-lg leading-snug text-charcoal transition-colors duration-300 group-hover:text-gold-dark">
            {product.title}
          </h3>
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={12} aria-hidden="true" /> {product.location}
          <span className="mx-1 text-forest/20">•</span>
          {product.condition}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-forest/10 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              {product.isAuction ? 'Current bid from' : 'Asking'}
            </p>
            <p className="font-serif text-xl text-forest">
              {formatPrice(product.isAuction ? product.startingBid : product.price)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <span className="flex items-center gap-1 text-xs" title="Views (sample)">
              <Eye size={13} aria-hidden="true" /> {product.views}
            </span>
            {showCompare && (
              <button
                type="button"
                onClick={() => toggleCompare(product.id)}
                disabled={compareFull}
                aria-pressed={inCompare}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-300 disabled:opacity-40 ${
                  inCompare
                    ? 'border-forest bg-forest text-ivory'
                    : 'border-forest/15 text-forest hover:border-gold hover:text-gold-dark'
                }`}
              >
                <Scale size={12} aria-hidden="true" />
                {inCompare ? 'Added' : 'Compare'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
