import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import SampleNotice from '../components/SampleNotice';
import { useMarketplace } from '../context/MarketplaceContext';
import { categories, categoryById } from '../data/categories';
import { collections, collectionById } from '../data/collections';
import { allBrands } from '../data/brands';
import { categoryIcons } from '../lib/categoryIcons';
import {
  CONDITIONS,
  PRICE_RANGES,
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  emptyFilters,
  parseFilters,
} from '../lib/listings';

const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export default function Explore() {
  const { products } = useMarketplace();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => parseFilters(location.search, collections));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Re-seed filters when the URL changes (e.g. from the navbar search).
  useEffect(() => {
    setFilters(parseFilters(location.search, collections));
  }, [location.search]);

  const results = useMemo(() => applyFilters(products, filters, collections), [products, filters]);
  const activeCount = countActiveFilters(filters);
  const brandOptions = useMemo(() => {
    const inUse = new Set(products.filter((p) => p.status === 'active').map((p) => p.brand));
    return allBrands.filter((b) => inUse.has(b));
  }, [products]);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => {
    setFilters({ ...emptyFilters, q: '' });
    navigate('/explore', { replace: true });
  };

  const heading = useHeading(filters);
  const panelProps = { filters, update, brandOptions, onReset: reset, activeCount };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-14 lg:px-10">
      {/* Header */}
      <header className="flex flex-col gap-8">
        <div>
          <p className="eyebrow">{heading.eyebrow}</p>
          <h1 className="mt-3 text-5xl leading-[1.05] sm:text-6xl">{heading.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{heading.description}</p>
        </div>

        <label className="relative flex items-center rounded-full border border-forest/15 bg-white px-6 py-4 shadow-[0_10px_30px_-22px_rgba(25,39,31,0.4)] transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
          <Search size={18} className="mr-3 shrink-0 text-muted" aria-hidden="true" />
          <span className="sr-only">Search by product, brand or location</span>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search by product, brand or location — e.g. Daytona, Milan, Birkin"
            className="w-full bg-transparent text-sm placeholder:text-muted focus:outline-none sm:text-base"
          />
          {filters.q && (
            <button type="button" onClick={() => update({ q: '' })} aria-label="Clear search" className="ml-2 rounded-full p-1 text-muted transition hover:text-forest">
              <X size={16} />
            </button>
          )}
        </label>

        {/* Category navigation */}
        <nav aria-label="Categories" className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-2 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0">
          <button
            type="button"
            onClick={() => update({ categories: [] })}
            className={`chip shrink-0 ${filters.categories.length === 0 ? 'chip-active' : ''}`}
            aria-pressed={filters.categories.length === 0}
          >
            All categories
          </button>
          {categories.map((c) => {
            const Icon = categoryIcons[c.id];
            const active = filters.categories.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => update({ categories: toggleIn(filters.categories, c.id) })}
                className={`chip shrink-0 ${active ? 'chip-active' : ''}`}
              >
                <Icon size={13} aria-hidden="true" />
                {c.name}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Toolbar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-forest/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn-ghost !py-2.5 lg:hidden"
            aria-expanded={drawerOpen}
          >
            <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-medium text-forest">{results.length}</span> {results.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        <label className="relative flex items-center gap-2 text-sm text-muted">
          <span className="hidden sm:inline">Sort by</span>
          <span className="relative">
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="appearance-none rounded-full border border-forest/15 bg-white py-2.5 pl-4 pr-10 text-sm text-forest focus:border-gold focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/60" aria-hidden="true" />
          </span>
        </label>
      </div>

      {/* Active filter chips */}
      <ActiveChips filters={filters} update={update} />

      <div className="mt-10 grid gap-12 lg:grid-cols-[250px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block" aria-label="Filters">
          <FilterPanel {...panelProps} />
        </aside>

        <section aria-label="Listings">
          <SampleNotice className="mb-8" />

          {results.length === 0 ? (
            <EmptyState
              title="No pieces match this search"
              description="Try a broader term, remove a filter, or explore a different category. New listings arrive every week."
              actionLabel="Reset all filters"
              onAction={reset}
            />
          ) : (
            <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[70] bg-charcoal/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[75] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-ivory p-6 shadow-soft lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl">Refine</h2>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close" className="rounded-full p-2 text-forest">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel {...panelProps} />
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary mt-8 w-full">
                Show {results.length} {results.length === 1 ? 'listing' : 'listings'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function useHeading(filters) {
  if (filters.collection) {
    const c = collectionById(filters.collection);
    return { eyebrow: 'Curated collection', title: c?.title || 'Collection', description: c?.description };
  }
  if (filters.auctionOnly) {
    return {
      eyebrow: 'Luxury auctions · preview',
      title: 'Timed sales',
      description: 'Listings running a timed auction. Bidding is simulated in this prototype.',
    };
  }
  if (filters.categories.length === 1) {
    const c = categoryById(filters.categories[0]);
    return { eyebrow: 'Category', title: c?.name, description: c?.blurb };
  }
  if (filters.brands.length === 1) {
    return { eyebrow: 'Brand', title: filters.brands[0], description: 'Every sample listing from this house, selected for condition and provenance.' };
  }
  return {
    eyebrow: 'Explore the marketplace',
    title: 'The Collection',
    description: 'Automobiles, motorcycles, watches, fashion and collectibles from private owners and trusted dealers.',
  };
}

function ActiveChips({ filters, update }) {
  const chips = [];
  filters.categories.forEach((id) => chips.push({ key: `cat-${id}`, label: categoryById(id)?.name, clear: () => update({ categories: filters.categories.filter((x) => x !== id) }) }));
  filters.brands.forEach((b) => chips.push({ key: `b-${b}`, label: b, clear: () => update({ brands: filters.brands.filter((x) => x !== b) }) }));
  filters.conditions.forEach((c) => chips.push({ key: `c-${c}`, label: c, clear: () => update({ conditions: filters.conditions.filter((x) => x !== c) }) }));
  if (filters.priceRange !== 'any') chips.push({ key: 'price', label: PRICE_RANGES.find((r) => r.id === filters.priceRange)?.label, clear: () => update({ priceRange: 'any' }) });
  if (filters.verifiedOnly) chips.push({ key: 'verified', label: 'Verified only', clear: () => update({ verifiedOnly: false }) });
  if (filters.auctionOnly) chips.push({ key: 'auction', label: 'Auctions', clear: () => update({ auctionOnly: false }) });
  if (filters.collection) chips.push({ key: 'collection', label: collectionById(filters.collection)?.title, clear: () => update({ collection: '' }) });

  if (!chips.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {chips.map((c) => (
        <button key={c.key} type="button" onClick={c.clear} className="chip chip-active !py-1.5 !text-[11px]">
          {c.label}
          <X size={12} aria-hidden="true" />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
    </div>
  );
}

function FilterPanel({ filters, update, brandOptions, onReset, activeCount }) {
  return (
    <div className="space-y-9">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/70">Refine</p>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="text-xs text-gold-dark underline-offset-4 hover:underline">
            Reset ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Verified & format">
        <Toggle label="Verified listings only" checked={filters.verifiedOnly} onChange={(v) => update({ verifiedOnly: v })} />
        <Toggle label="Timed auctions" checked={filters.auctionOnly} onChange={(v) => update({ auctionOnly: v })} />
      </FilterGroup>

      <FilterGroup title="Brand">
        <ul className="max-h-60 space-y-2.5 overflow-y-auto pr-2">
          {brandOptions.map((b) => (
            <li key={b}>
              <Checkbox label={b} checked={filters.brands.includes(b)} onChange={() => update({ brands: toggleIn(filters.brands, b) })} />
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Condition">
        <ul className="space-y-2.5">
          {CONDITIONS.map((c) => (
            <li key={c}>
              <Checkbox label={c} checked={filters.conditions.includes(c)} onChange={() => update({ conditions: toggleIn(filters.conditions, c) })} />
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((r) => {
            const active = filters.priceRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={active}
                onClick={() => update({ priceRange: r.id })}
                className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-300 ${
                  active ? 'border-forest bg-forest text-ivory' : 'border-forest/10 bg-white text-forest hover:border-gold'
                }`}
              >
                {r.label}
                {active && <Check size={14} className="text-gold" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-forest/70">{title}</legend>
      {children}
    </fieldset>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm text-forest/85">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 ${
          checked ? 'border-forest bg-forest text-gold' : 'border-forest/25 bg-white group-hover:border-gold'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} aria-hidden="true" />}
      </span>
      {label}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm text-forest/85">
      {label}
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 ${
          checked ? 'bg-forest' : 'bg-forest/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition-transform duration-300 ${
            checked ? 'translate-x-[22px] bg-gold' : 'translate-x-0.5'
          }`}
        />
      </span>
    </label>
  );
}
