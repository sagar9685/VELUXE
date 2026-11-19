import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Scale, X } from 'lucide-react';
import Modal from './Modal';
import ImageWithFallback from './ImageWithFallback';
import { AuthenticityBadge } from './Badges';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice } from '../lib/format';
import { sellerById } from '../data/sellers';

export default function CompareBar() {
  const { compare, products, toggleCompare, clearCompare, maxCompare } = useMarketplace();
  const [open, setOpen] = useState(false);
  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-24 z-40 mx-auto flex w-[min(94vw,760px)] sm:bottom-6 flex-wrap items-center gap-4 rounded-3xl bg-forest/95 p-4 text-ivory shadow-soft backdrop-blur-xl"
            role="region"
            aria-label="Product comparison tray"
          >
            <div className="flex items-center gap-2 pl-2 text-gold">
              <Scale size={16} aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.2em]">Compare</span>
            </div>
            <div className="flex flex-1 items-center gap-3 overflow-x-auto no-scrollbar">
              {items.map((p) => (
                <div key={p.id} className="flex min-w-[170px] items-center gap-3 rounded-2xl bg-white/5 p-2 pr-3">
                  <ImageWithFallback src={p.images?.[0]} alt={p.title} label={p.brand} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <p className="min-w-0 flex-1 truncate text-xs">{p.title}</p>
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remove ${p.title} from comparison`}
                    className="rounded-full p-1 text-ivory/60 transition hover:text-gold"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {Array.from({ length: maxCompare - items.length }).map((_, i) => (
                <div key={i} className="grid h-[60px] min-w-[120px] place-items-center rounded-2xl border border-dashed border-ivory/20 text-[11px] text-ivory/40">
                  Add a listing
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={clearCompare} className="px-3 text-xs text-ivory/60 transition hover:text-ivory">
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={items.length < 2}
                className="btn-gold !py-3 text-xs disabled:!bg-gold/40"
              >
                Compare {items.length}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal open={open} onClose={() => setOpen(false)} items={items} />
    </>
  );
}

function CompareModal({ open, onClose, items }) {
  const rows = [
    { label: 'Brand', render: (p) => p.brand },
    { label: 'Model', render: (p) => p.model },
    { label: 'Year', render: (p) => p.year },
    { label: 'Asking price', render: (p) => (p.isAuction ? `Auction from ${formatPrice(p.startingBid)}` : formatPrice(p.price)) },
    { label: 'Condition', render: (p) => p.condition },
    { label: 'Location', render: (p) => p.location },
    { label: 'Seller', render: (p) => sellerById(p.sellerId)?.studio || '—' },
    { label: 'Authenticity', render: (p) => <AuthenticityBadge status={p.authenticity} /> },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Compare listings" subtitle="Side-by-side view of your selection." widthClass="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="w-40 pb-4" />
              {items.map((p) => (
                <th key={p.id} className="pb-4 align-top font-normal">
                  <ImageWithFallback src={p.images?.[0]} alt={p.title} label={p.brand} className="mb-3 aspect-[4/3] w-full rounded-xl object-cover" />
                  <p className="font-serif text-base text-forest">{p.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-forest/10">
                <th scope="row" className="py-3.5 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                  {row.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="py-3.5 pr-4 text-charcoal">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
