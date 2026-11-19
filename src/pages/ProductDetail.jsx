import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Eye, Gavel, Heart, Info, MapPin, MessageCircle, Scale, Tag } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import ProductCard from '../components/ProductCard';
import OfferModal from '../components/OfferModal';
import ContactModal from '../components/ContactModal';
import AuctionCountdown from '../components/AuctionCountdown';
import SampleNotice from '../components/SampleNotice';
import { AuthenticityBadge, ConditionBadge, authenticityFor } from '../components/Badges';
import Reveal from '../components/Reveal';
import { useMarketplace } from '../context/MarketplaceContext';
import { sellerById, initialsOf } from '../data/sellers';
import { categoryById } from '../data/categories';
import { formatDate, formatPrice } from '../lib/format';
import { SITE } from '../config/site';

export default function ProductDetail() {
  const { productId } = useParams();
  const { getProduct, products, recordView, isFavorite, toggleFavorite, toggleCompare, compare, maxCompare, pushNotification, showToast } = useMarketplace();
  const product = getProduct(productId);
  const [index, setIndex] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Count one view per product visit.
  useEffect(() => {
    if (product) recordView(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Reset gallery and auction state when navigating between listings.
  useEffect(() => {
    setIndex(0);
    setRegistered(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [productId]);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="eyebrow">Listing unavailable</p>
        <h1 className="mt-4 text-4xl">This piece has found a new home</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">The listing may have been sold, paused or removed. Explore similar pieces in the marketplace.</p>
        <Link to="/explore" className="btn-primary mt-10">
          Back to the marketplace
        </Link>
      </div>
    );
  }

  const seller = sellerById(product.sellerId);
  const auth = authenticityFor(product.authenticity);
  const category = categoryById(product.category);
  const saved = isFavorite(product.id);
  const inCompare = compare.includes(product.id);
  const compareFull = !inCompare && compare.length >= maxCompare;
  const similar = products
    .filter((p) => p.id !== product.id && p.status === 'active' && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);
  const images = product.images?.length ? product.images : [null];
  const isSold = product.status === 'sold';

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const register = () => {
    setRegistered(true);
    pushNotification({ type: 'auction', title: 'Registered to bid', body: `You are registered for the ${product.title} auction (demo). We will remind you before it closes.` });
    showToast('You are registered to bid (demo)');
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-8 lg:px-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link to="/explore" className="flex items-center gap-1.5 transition hover:text-forest">
          <ArrowLeft size={13} /> Marketplace
        </Link>
        <span>/</span>
        {category && (
          <Link to={`/explore?category=${category.id}`} className="transition hover:text-forest">
            {category.name}
          </Link>
        )}
        <span>/</span>
        <span className="truncate text-forest/70">{product.title}</span>
      </nav>

      <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-forest/5 sm:aspect-[5/4] lg:aspect-[4/5]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ImageWithFallback src={images[index]} alt={`${product.title}, photo ${index + 1}`} label={product.brand} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button type="button" onClick={prev} aria-label="Previous photo" className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-forest shadow-sm transition hover:bg-gold">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={next} aria-label="Next photo" className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-forest shadow-sm transition hover:bg-gold">
                  <ChevronRight size={20} />
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-charcoal/70 px-3 py-1 text-[11px] tracking-wider text-ivory backdrop-blur">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
            {product.verified && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-forest">
                <BadgeCheck size={13} className="text-gold-dark" /> Verified listing
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  className={`relative aspect-square overflow-hidden rounded-2xl transition-all duration-300 ${
                    i === index ? 'ring-2 ring-gold ring-offset-2 ring-offset-ivory' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={src} alt="" label="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="lg:col-span-5">
          <SampleNotice />

          <p className="eyebrow mt-6">{product.brand}</p>
          <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{product.title}</h1>
          <p className="mt-3 text-sm text-muted">{product.model} · {product.year}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ConditionBadge condition={product.condition} />
            <AuthenticityBadge status={product.authenticity} />
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <MapPin size={13} /> {product.location}
            </span>
          </div>

          {/* Price block */}
          <div className="mt-10 rounded-3xl bg-white p-7 ring-1 ring-forest/5">
            {product.isAuction ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Starting bid</p>
                    <p className="mt-1 font-serif text-4xl text-forest">{formatPrice(product.startingBid)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Closes in</p>
                    <AuctionCountdown endsAt={product.auctionEndsAt} className="mt-1 text-lg" />
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Reserve price not disclosed. Bidding in this prototype is simulated.
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Asking price</p>
                <p className="mt-1 font-serif text-4xl text-forest">{formatPrice(product.price)}</p>
                <p className="mt-2 text-xs text-muted">Listed {formatDate(product.listedAt)} · {product.views} views (sample)</p>
              </>
            )}

            <div className="mt-7 grid gap-3">
              {product.isAuction ? (
                <button type="button" onClick={register} disabled={registered || isSold} className="btn-primary">
                  <Gavel size={16} /> {registered ? 'Registered to bid' : 'Register to bid'}
                </button>
              ) : (
                <button type="button" onClick={() => setOfferOpen(true)} disabled={isSold} className="btn-primary">
                  <Tag size={16} /> Make an Offer
                </button>
              )}
              <button type="button" onClick={() => setContactOpen(true)} disabled={isSold} className="btn-ghost">
                <MessageCircle size={16} /> Contact Seller
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  aria-pressed={saved}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm transition-all duration-300 ${
                    saved ? 'border-gold bg-gold/10 text-gold-dark' : 'border-forest/15 text-forest hover:border-gold'
                  }`}
                >
                  <Heart size={15} className={saved ? 'fill-gold' : ''} />
                  {saved ? 'Saved' : 'Save to Wishlist'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  disabled={compareFull}
                  aria-pressed={inCompare}
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm transition-all duration-300 disabled:opacity-40 ${
                    inCompare ? 'border-forest bg-forest text-ivory' : 'border-forest/15 text-forest hover:border-gold'
                  }`}
                >
                  <Scale size={15} />
                  {inCompare ? 'In comparison' : 'Compare'}
                </button>
              </div>
            </div>
          </div>

          {/* Authenticity */}
          <div className="mt-6 rounded-3xl border border-forest/10 bg-ivory p-7">
            <div className="flex items-center gap-3">
              <BadgeCheck size={20} className="text-gold-dark" aria-hidden="true" />
              <h2 className="text-xl">Authenticity status</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{auth.note}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {product.conditionNote}
            </p>
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white p-4 text-xs leading-relaxed text-forest/75 ring-1 ring-forest/5">
              <Info size={14} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />
              Statuses are illustrative in this prototype. No listing has been authenticated by a real examiner.
            </p>
          </div>

          {/* Seller */}
          {seller && (
            <div className="mt-6 rounded-3xl bg-forest p-7 text-ivory">
              <p className="eyebrow !text-gold">Seller</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-gold/15 font-serif text-lg text-gold ring-1 ring-gold/30">
                  {seller.avatar ? (
                    <ImageWithFallback src={seller.avatar} alt={seller.name} label="" className="h-full w-full object-cover" />
                  ) : (
                    initialsOf(seller.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-serif text-xl">
                    {seller.studio}
                    {seller.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-gold">
                        <BadgeCheck size={11} /> Verified seller
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ivory/60">
                    {seller.name} · {seller.location}
                  </p>
                </div>
              </div>
              {seller.demoRating && (
                <p className="mt-4 text-xs text-ivory/60">
                  ★ {seller.demoRating.toFixed(1)} · {seller.demoReviews} reviews <span className="text-ivory/40">(sample rating)</span>
                </p>
              )}
              <Link to={`/seller/${seller.id}`} className="mt-6 inline-flex items-center gap-2 text-sm text-gold transition hover:gap-3">
                View storefront <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Specs & description */}
      <div className="mt-28 grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">The piece</p>
          <h2 className="mt-4 text-4xl leading-tight">About this {category?.name.toLowerCase().replace(/s$/, '') || 'listing'}</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">{product.description}</p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-gold/10 p-5 text-sm leading-relaxed text-forest/80">
            <Eye size={16} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />
            <span>
              Condition: <strong className="font-medium text-forest">{product.condition}</strong>. {product.conditionNote}
            </span>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <p className="eyebrow">Specifications</p>
          <dl className="mt-6 divide-y divide-forest/10 border-y border-forest/10">
            {product.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[180px_1fr] gap-6 py-4 text-sm">
                <dt className="text-muted">{s.label}</dt>
                <dd className="text-forest">{s.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[180px_1fr] gap-6 py-4 text-sm">
              <dt className="text-muted">Year</dt>
              <dd className="text-forest">{product.year}</dd>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-6 py-4 text-sm">
              <dt className="text-muted">Location</dt>
              <dd className="text-forest">{product.location}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted">
            Specifications are provided by the seller and shown as sample data. Please verify all details directly with the seller before any transaction.
          </p>
        </Reveal>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-32">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">You may also admire</p>
              <h2 className="mt-3 text-4xl">Similar pieces</h2>
            </div>
            <Link to={`/explore?category=${product.category}`} className="btn-ghost self-start sm:self-auto">
              More in {category?.name} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} product={product} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} product={product} />
      <span className="sr-only">{SITE.demoNotice}</span>
    </div>
  );
}
