import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, CalendarDays, Clock, MapPin, MessageCircle, Star } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import SampleNotice from '../components/SampleNotice';
import { useMarketplace } from '../context/MarketplaceContext';
import { sellerById, initialsOf } from '../data/sellers';
import { formatDate } from '../lib/format';

export default function SellerStorefront() {
  const { sellerId } = useParams();
  const seller = sellerById(sellerId);
  const { products, pushNotification, showToast } = useMarketplace();
  const [contactOpen, setContactOpen] = useState(false);

  if (!seller) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow">Storefront not found</p>
        <h1 className="mt-4 text-4xl">We could not find this seller</h1>
        <Link to="/explore" className="btn-primary mt-10">
          Return to the marketplace
        </Link>
      </div>
    );
  }

  const listings = products.filter((p) => p.sellerId === seller.id && p.status === 'active');

  return (
    <div className="pb-28">
      {/* Banner */}
      <section className="relative h-[300px] overflow-hidden bg-forest sm:h-[380px]">
        <ImageWithFallback src={seller.banner} alt="" label={seller.studio} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Profile */}
        <div className="-mt-16 relative grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
          <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-4 border-ivory bg-forest font-serif text-3xl text-gold shadow-soft">
            {seller.avatar ? (
              <ImageWithFallback src={seller.avatar} alt={`${seller.name}, profile photo`} label="" className="h-full w-full object-cover" />
            ) : (
              initialsOf(seller.name)
            )}
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl sm:text-5xl">{seller.studio}</h1>
                {seller.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-gold-dark ring-1 ring-gold/40">
                    <BadgeCheck size={14} /> Verified seller
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-charcoal ring-1 ring-forest/10">
                    <Clock size={13} /> Verification in progress
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-muted">{seller.name}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {seller.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> Member since {formatDate(seller.memberSince)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
              <div className="rounded-2xl bg-white px-6 py-4 ring-1 ring-forest/5">
                {seller.demoRating ? (
                  <>
                    <p className="flex items-center gap-2 font-serif text-2xl text-forest">
                      <Star size={18} className="fill-gold text-gold" /> {seller.demoRating.toFixed(1)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">{seller.demoReviews} reviews · sample</p>
                  </>
                ) : (
                  <>
                    <p className="font-serif text-lg text-forest">No ratings yet</p>
                    <p className="mt-1 text-[11px] text-muted">Sample data</p>
                  </>
                )}
              </div>
              <button type="button" onClick={() => setContactOpen(true)} className="btn-primary">
                <MessageCircle size={16} /> Contact seller
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">About the studio</p>
            <p className="mt-4 text-base leading-relaxed text-muted">{seller.bio}</p>
            <div className="mt-8">
              <SampleNotice />
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Ratings and review counts are demonstration values. Verification status is illustrative and does not represent a real identity check.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Current listings</p>
                <h2 className="mt-2 text-3xl">{listings.length} {listings.length === 1 ? 'piece' : 'pieces'} available</h2>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="No active listings"
                  description="This studio has no pieces on the market right now. Check back soon, or explore the wider marketplace."
                  actionLabel="Explore the marketplace"
                  actionTo="/explore"
                />
              </div>
            ) : (
              <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2">
                {listings.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SellerContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        seller={seller}
        onSend={(message) => {
          pushNotification({ type: 'inquiry', title: 'Message sent', body: `Your message to ${seller.studio} was delivered (demo).` });
          showToast('Message sent to the seller (demo)');
          setContactOpen(false);
          return message;
        }}
      />
    </div>
  );
}

function SellerContactModal({ open, onClose, seller, onSend }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const close = () => {
    setMessage('');
    setError('');
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError('Please write at least ten characters.');
      return;
    }
    onSend(message.trim());
    setMessage('');
    setError('');
  };

  return (
    <Modal open={open} onClose={close} title={`Contact ${seller.studio}`} subtitle="Ask about any of their listings or request a private viewing.">
      <form onSubmit={submit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="seller-message" className="text-xs font-medium uppercase tracking-[0.18em] text-forest/70">
            Your message
          </label>
          <textarea
            id="seller-message"
            rows={5}
            maxLength={800}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError('');
            }}
            placeholder="Hello, I'd love to learn more about your current pieces…"
            className="input-lux mt-2 resize-none"
            aria-invalid={Boolean(error)}
          />
          <p className={`mt-2 text-xs ${error ? 'text-red-700' : 'text-muted'}`}>{error || 'Messages are demonstration only and are not delivered.'}</p>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Send message
          </button>
        </div>
      </form>
    </Modal>
  );
}
