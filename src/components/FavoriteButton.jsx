import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function FavoriteButton({ productId, className = '' }) {
  const { isFavorite, toggleFavorite } = useMarketplace();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`grid h-10 w-10 place-items-center rounded-full bg-ivory/95 text-charcoal shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 hover:text-gold-dark ${className}`}
    >
      <motion.span
        key={String(active)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart size={17} className={active ? 'fill-gold text-gold' : ''} />
      </motion.span>
    </button>
  );
}
