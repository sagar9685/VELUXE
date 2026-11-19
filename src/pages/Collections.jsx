import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { collections } from '../data/collections';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Collections() {
  const { products } = useMarketplace();

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-14 lg:px-10">
      <SectionHeading
        eyebrow="Exclusive collections"
        title="Edits assembled by our team"
        description="Each collection gathers pieces that share a provenance, a spirit or a story. Selections are updated as new listings arrive."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {collections.map((c, i) => {
          const count = products.filter((p) => p.status === 'active' && (p.tags || []).includes(c.tag)).length;
          return (
            <Reveal key={c.id} delay={i * 0.05} className={i === 0 ? 'md:col-span-2' : ''}>
              <Link to={`/explore?collection=${c.id}`} className="group relative block overflow-hidden rounded-3xl bg-forest">
                <div className={`relative ${i === 0 ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
                  <ImageWithFallback src={c.image} alt={c.title} label={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-ivory md:p-10">
                  <div className="max-w-lg">
                    <p className="eyebrow !text-gold">{count} {count === 1 ? 'piece' : 'pieces'}</p>
                    <h2 className="mt-3 text-3xl md:text-4xl">{c.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/70">{c.description}</p>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
