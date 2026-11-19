import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BadgeCheck, Bell, Gavel, Lock, ShieldCheck, Timer, Truck, Users } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import AuctionCountdown from '../components/AuctionCountdown';
import { categories } from '../data/categories';
import { featuredBrands, allBrands } from '../data/brands';
import { collections } from '../data/collections';
import { drops } from '../data/drops';
import { sellerById } from '../data/sellers';
import { useMarketplace } from '../context/MarketplaceContext';
import { categoryIcons } from '../lib/categoryIcons';
import { HERO_IMAGE } from '../lib/images';
import { formatCountdown, formatPrice } from '../lib/format';
import useNow from '../lib/useNow';
import { SITE } from '../config/site';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandTicker />
      <CategoryGrid />
      <FeaturedBrands />
      <FeaturedListings />
      <Collections />
      <Drops />
      <AuctionsPreview />
      <VerifiedBenefits />
      <HowItWorks />
      <SellerInvitation />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-7rem)] items-end overflow-hidden bg-charcoal text-ivory">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <ImageWithFallback src={HERO_IMAGE} alt="Premium sports car in low light" label={SITE.name} className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/80 via-transparent to-transparent" />

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="eyebrow !text-gold"
        >
          Automobiles · Motorcycles · Watches · Maison
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-8xl"
        >
          Extraordinary Things Deserve a <em className="font-serif italic text-gold">Second Story</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
        >
          {SITE.name} is where premium machines, watches and maison pieces find their next custodian — presented with the care of a private showroom.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link to="/explore" className="btn-gold">
            Explore Collection <ArrowRight size={16} />
          </Link>
          <Link to="/sell" className="btn-light">
            Sell Your Item
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-6 hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/50 lg:flex">
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="h-14 w-px animate-floaty bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Brand ticker */

function BrandTicker() {
  const items = [...allBrands, ...allBrands];
  return (
    <div className="overflow-hidden border-y border-forest/10 bg-white py-5" aria-label="Brands we curate">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {items.map((brand, i) => (
          <span key={`${brand}-${i}`} className="flex items-center gap-12 font-serif text-2xl text-forest/70">
            {brand}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------- Category cards */

function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">
      <SectionHeading
        eyebrow="Shop by category"
        title="A showroom for every passion"
        description="From the open road to the racing paddock — each category is curated with its own standards."
      />
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => {
          const Icon = categoryIcons[cat.id];
          const wide = i === 0;
          return (
            <Reveal key={cat.id} delay={i * 0.05} className={wide ? 'lg:col-span-2' : ''}>
              <Link
                to={`/explore?category=${cat.id}`}
                className="group relative block overflow-hidden rounded-3xl bg-forest"
              >
                <div className={`relative ${wide ? 'aspect-[16/10] lg:aspect-[2/1]' : 'aspect-[4/5]'}`}>
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    label={cat.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-ivory">
                  <div>
                    <Icon size={22} className="mb-3 text-gold" aria-hidden="true" />
                    <h3 className={`${wide ? 'text-3xl lg:text-4xl' : 'text-2xl'} text-ivory`}>{cat.name}</h3>
                    <p className="mt-1.5 text-sm text-ivory/65">{cat.blurb}</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Featured brands */

function FeaturedBrands() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Featured brands" title="Houses we know by heart" />
          <Link to="/explore" className="btn-ghost self-start md:self-auto">
            All brands <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-forest/10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBrands.map((brand, i) => (
            <Reveal key={brand.name} delay={i * 0.04}>
              <Link
                to={`/explore?brand=${encodeURIComponent(brand.name)}`}
                className="group relative flex h-full min-h-[210px] flex-col justify-between bg-ivory p-8 transition-colors duration-500 hover:bg-forest"
              >
                <span className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
                <div className="flex items-start justify-between">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted transition-colors group-hover:text-gold">
                    {brand.origin}
                  </p>
                  <ArrowUpRight size={18} className="text-forest/30 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold" />
                </div>
                <div>
                  <h3 className="text-3xl transition-colors group-hover:text-ivory">{brand.name}</h3>
                  <p className="mt-2 text-sm text-muted transition-colors group-hover:text-ivory/70">{brand.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Featured listings */

function FeaturedListings() {
  const { products } = useMarketplace();
  const featured = products.filter((p) => p.featured && p.status === 'active').slice(0, 4);
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading eyebrow="Featured listings" title="This week's most coveted pieces" />
        <Link to="/explore?sort=relevance" className="btn-ghost self-start md:self-auto">
          View all listings <ArrowRight size={15} />
        </Link>
      </div>
      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard product={p} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Collections */

function Collections() {
  return (
    <section className="bg-charcoal py-28 text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeading
          light
          eyebrow="Curated collections"
          title="Edits, assembled by our team"
          description="Each collection brings together pieces that share a provenance, a spirit or a story."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05} className={i === 0 ? 'md:col-span-2' : ''}>
              <Link
                to={`/explore?collection=${c.id}`}
                className={`group relative block overflow-hidden rounded-3xl ${i === 0 ? 'aspect-[16/8]' : 'aspect-[16/11]'}`}
              >
                <ImageWithFallback
                  src={c.image}
                  alt={c.title}
                  label={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 md:p-9">
                  <div className="max-w-md">
                    <p className="eyebrow !text-gold">Collection {String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mt-3 text-3xl md:text-4xl">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/70">{c.description}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-2 text-sm text-gold transition-all duration-500 group-hover:gap-3 sm:flex">
                    Explore <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Exclusive drops */

function Drops() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">
      <SectionHeading
        eyebrow="Exclusive drops"
        title="Numbered releases, announced in advance"
        description="Members receive first access. Once a drop closes, it does not return."
      />
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {drops.map((drop, i) => (
          <Reveal key={drop.id} delay={i * 0.08}>
            <DropCard drop={drop} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function DropCard({ drop }) {
  const now = useNow();
  const { pushNotification, showToast } = useMarketplace();
  const remaining = new Date(drop.startsAt).getTime() - now;
  const [subscribed, setSubscribed] = useState(false);

  const notify = () => {
    if (subscribed) return;
    setSubscribed(true);
    pushNotification({ type: 'drop', title: 'Drop reminder set', body: `We will remind you before ${drop.title} opens.` });
    showToast('We will remind you before this drop opens');
  };

  return (
    <div className="group relative grid overflow-hidden rounded-3xl bg-forest text-ivory md:grid-cols-5">
      <div className="relative aspect-[4/3] md:col-span-2 md:aspect-auto">
        <ImageWithFallback src={drop.image} alt={drop.title} label={drop.accent} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
      </div>
      <div className="flex flex-col justify-between gap-8 p-8 md:col-span-3 md:p-10">
        <div>
          <p className="eyebrow !text-gold">{drop.accent}</p>
          <h3 className="mt-3 text-3xl md:text-4xl">{drop.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">{drop.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/50">Opens in</p>
            <p className="mt-1.5 font-mono text-2xl tabular-nums text-gold">{formatCountdown(remaining)}</p>
          </div>
          <button type="button" onClick={notify} disabled={subscribed} className="btn-light !py-3 !text-xs disabled:opacity-60">
            <Bell size={14} />
            {subscribed ? 'Reminder set' : 'Notify me'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- Auctions preview */

function AuctionsPreview() {
  const { products } = useMarketplace();
  const auctions = products.filter((p) => p.isAuction && p.status === 'active');
  if (!auctions.length) return null;

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Luxury auctions · preview"
            title="Timed sales, watched closely"
            description="A preview of our private auction format. Bidding is simulated in this prototype."
          />
          <Link to="/explore?auction=1" className="btn-ghost self-start md:self-auto">
            <Gavel size={15} /> All auctions
          </Link>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {auctions.map((p, i) => {
            const seller = sellerById(p.sellerId);
            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link
                  to={`/product/${p.id}`}
                  className="group grid overflow-hidden rounded-3xl bg-ivory ring-1 ring-forest/5 transition-shadow duration-500 hover:shadow-soft sm:grid-cols-5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden sm:col-span-2 sm:aspect-auto">
                    <ImageWithFallback src={p.images[0]} alt={p.title} label={p.brand} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-between gap-6 p-7 sm:col-span-3">
                    <div>
                      <p className="eyebrow">{p.brand}</p>
                      <h3 className="mt-2 text-2xl">{p.title}</h3>
                      <p className="mt-2 text-xs text-muted">Seller: {seller?.studio}</p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted">
                          <Timer size={12} /> Closes in
                        </p>
                        <AuctionCountdown endsAt={p.auctionEndsAt} className="mt-1 text-base" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Starting bid</p>
                        <p className="font-serif text-2xl text-forest">{formatPrice(p.startingBid)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------- Verified benefits */

const benefits = [
  { icon: BadgeCheck, title: 'Verified listings', text: 'Verified records are reviewed by our Authenticity Desk before they carry the badge.' },
  { icon: Lock, title: 'Protected offers', text: 'Offers and messages travel through the marketplace, keeping your details private.' },
  { icon: Truck, title: 'White-glove handover', text: 'Insured collection and delivery arranged by our concierge for high-value pieces.' },
  { icon: Users, title: 'Accountable sellers', text: 'Verified seller profiles show their studio, location and standing at a glance.' },
];

function VerifiedBenefits() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="The VELUXE standard" title="Verified, from first view to final handover" />
        </div>
        <div className="grid gap-px overflow-hidden rounded-3xl bg-forest/10 sm:grid-cols-2 lg:col-span-8">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="group h-full bg-ivory p-8 transition-colors duration-500 hover:bg-white">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-forest text-gold transition-transform duration-500 group-hover:-rotate-6">
                  <b.icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-7 text-2xl">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- How it works */

const steps = [
  { n: '01', title: 'Discover', text: 'Browse curated categories, brands and collections, or search by product and city.' },
  { n: '02', title: 'Inspect', text: 'Review the gallery, condition notes, specifications and the authenticity status of each listing.' },
  { n: '03', title: 'Negotiate', text: 'Make an offer or contact the seller directly. Every conversation stays within the marketplace.' },
  { n: '04', title: 'Complete', text: 'Arrange handover with our concierge. Your piece receives a new story.' },
];

function HowItWorks() {
  return (
    <section className="bg-forest py-28 text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeading light eyebrow="How it works" title="Four quiet steps to your next acquisition" />
        <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative border-t border-gold/40 pt-8">
                <span className="font-serif text-5xl text-gold/80">{s.n}</span>
                <h3 className="mt-6 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Seller invitation */

function SellerInvitation() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10">
      <Reveal>
        <div className="relative grid overflow-hidden rounded-[2rem] bg-ivory ring-1 ring-forest/10 lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury wristwatch on a dark surface"
              label="Sell with VELUXE"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-8 p-10 md:p-16">
            <p className="eyebrow">A private invitation</p>
            <h2 className="text-4xl leading-[1.1] md:text-5xl">Be the custodian of something rare.</h2>
            <p className="max-w-md text-base leading-relaxed text-muted">
              List your automobile, motorcycle, watch or maison piece in a few guided steps. Our concierge will help you present it with the detail it deserves.
            </p>
            <ul className="space-y-3 text-sm text-forest/80">
              {['Guided listing with photo and specification prompts', 'Optional authenticity review for verified status', 'A storefront that tells your story as a seller'].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/sell" className="btn-primary">
                Begin your listing <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard/seller" className="btn-ghost">
                Open seller studio
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
