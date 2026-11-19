import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Check, Loader2, Sparkles, Trash2, Upload } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import { AuthenticityBadge, ConditionBadge } from '../components/Badges';
import SampleNotice from '../components/SampleNotice';
import { useMarketplace } from '../context/MarketplaceContext';
import { categories, categoryById } from '../data/categories';
import { allBrands } from '../data/brands';
import { categoryIcons } from '../lib/categoryIcons';
import { CONDITIONS } from '../lib/listings';
import { formatPrice } from '../lib/format';

const STEPS = ['Category', 'Brand & model', 'Photos', 'Specifications', 'Condition', 'Asking price', 'Description', 'Preview'];
const MAX_PHOTOS = 8;

const SPEC_FIELDS = {
  motorcycles: ['Engine', 'Mileage', 'Color', 'Included accessories'],
  automobiles: ['Engine', 'Power', 'Transmission', 'Mileage', 'Color'],
  'riding-gear': ['Size', 'Material', 'Color'],
  watches: ['Reference number', 'Case size', 'Movement', 'Box & papers'],
  bags: ['Size', 'Material', 'Hardware', 'Color'],
  fashion: ['Size', 'Colorway', 'Release year'],
  collectibles: ['Scale or edition', 'Edition size', 'Packaging'],
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const CONDITION_NOTES = {
  New: 'Unused, with original packaging or tags.',
  'Like New': 'Used very lightly. No visible wear.',
  Excellent: 'Minimal wear. Fully functional and presentable.',
  'Very Good': 'Light wear consistent with careful use.',
  Good: 'Visible wear. Fully functional. Described honestly.',
};

const initialDraft = {
  categoryId: '',
  brand: '',
  model: '',
  year: '',
  title: '',
  location: '',
  photos: [],
  specs: {},
  condition: '',
  conditionNote: '',
  price: '',
  description: '',
};

export default function Sell() {
  const navigate = useNavigate();
  const { products, publishListing, showToast } = useMarketplace();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState(initialDraft);
  const [publishing, setPublishing] = useState(false);
  const photosRef = useRef(draft.photos);
  const publishedRef = useRef(false);
  photosRef.current = draft.photos;

  // Release preview URLs when leaving the wizard without publishing.
  // Published listings keep their photos for the rest of the session.
  useEffect(
    () => () => {
      if (!publishedRef.current) photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    },
    [],
  );

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const category = categoryById(draft.categoryId);
  const specFields = category ? SPEC_FIELDS[category.id] : [];

  const valid = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(draft.categoryId);
      case 1:
        return Boolean(draft.brand.trim() && draft.model.trim() && /^\d{4}$/.test(draft.year) && draft.location.trim() && draft.title.trim());
      case 2:
        return draft.photos.length > 0;
      case 3:
        return specFields.every((f) => (draft.specs[f] || '').trim());
      case 4:
        return Boolean(draft.condition);
      case 5:
        return Number(draft.price) > 0;
      case 6:
        return draft.description.trim().length >= 40;
      default:
        return true;
    }
  }, [step, draft, specFields]);

  const go = (n) => {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  };

  const publish = () => {
    setPublishing(true);
    setTimeout(() => {
      publishedRef.current = true;
      const product = publishListing({
        title: draft.title.trim(),
        brand: draft.brand.trim(),
        category: draft.categoryId,
        model: draft.model.trim(),
        year: Number(draft.year),
        price: Number(draft.price),
        condition: draft.condition,
        conditionNote: draft.conditionNote.trim() || CONDITION_NOTES[draft.condition],
        location: draft.location.trim(),
        description: draft.description.trim(),
        specs: specFields.map((label) => ({ label, value: draft.specs[label] })),
        images: draft.photos.map((p) => p.url),
        tags: [],
        isAuction: false,
        startingBid: null,
        auctionEndsAt: null,
      });
      showToast('Your demo listing is live');
      navigate(`/product/${product.id}`);
    }, 1400);
  };

  const slide = {
    enter: (d) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-28 pt-12 lg:px-10">
      <Link to="/explore" className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-forest">
        <ArrowLeft size={13} /> Back to marketplace
      </Link>

      <header className="mt-8">
        <p className="eyebrow">Sell with VELUXE</p>
        <h1 className="mt-3 text-5xl leading-[1.05] sm:text-6xl">Create your listing</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Present your piece with the care it deserves. Publishing here creates a demonstration listing only.
        </p>
      </header>

      <Stepper step={step} onJump={(n) => n < step && go(n)} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="min-h-[460px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <StepCategory value={draft.categoryId} onSelect={(id) => update({ categoryId: id, specs: {} })} />}
              {step === 1 && <StepBrand draft={draft} update={update} />}
              {step === 2 && <StepPhotos draft={draft} update={update} />}
              {step === 3 && <StepSpecs fields={specFields} draft={draft} update={update} />}
              {step === 4 && <StepCondition draft={draft} update={update} />}
              {step === 5 && <StepPrice draft={draft} update={update} categoryId={draft.categoryId} products={products} />}
              {step === 6 && <StepDescription draft={draft} update={update} />}
              {step === 7 && <StepPreview draft={draft} category={category} specFields={specFields} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-14 flex items-center justify-between gap-4 border-t border-forest/10 pt-8">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0 || publishing} className="btn-ghost">
              <ArrowLeft size={15} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(step + 1)} disabled={!valid} className="btn-primary">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={publish} disabled={publishing} className="btn-gold">
                {publishing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Publishing…
                  </>
                ) : (
                  <>
                    Publish demo listing <Check size={15} />
                  </>
                )}
              </button>
            )}
          </div>
          {step < STEPS.length - 1 && !valid && (
            <p className="mt-4 text-right text-xs text-muted">Complete this step to continue.</p>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-3xl bg-forest p-6 text-ivory">
              <p className="eyebrow !text-gold">Your listing</p>
              <dl className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Category" value={category?.name} />
                <SummaryRow label="Brand" value={draft.brand} />
                <SummaryRow label="Model" value={draft.model} />
                <SummaryRow label="Photos" value={draft.photos.length ? `${draft.photos.length} added` : ''} />
                <SummaryRow label="Condition" value={draft.condition} />
                <SummaryRow label="Asking" value={draft.price ? formatPrice(Number(draft.price)) : ''} />
              </dl>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Listings in this prototype are stored in memory for the session and are not sent to any server.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ivory/10 pb-2.5">
      <dt className="text-ivory/50">{label}</dt>
      <dd className="truncate text-right text-ivory">{value || <span className="text-ivory/30">—</span>}</dd>
    </div>
  );
}

function Stepper({ step, onJump }) {
  const pct = (step / (STEPS.length - 1)) * 100;
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted">
        <span>
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-forest">{STEPS[step]}</span>
      </div>
      <div className="mt-4 h-px w-full bg-forest/10">
        <motion.div className="h-px bg-gold" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <ol className="mt-5 hidden gap-2 md:flex">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i > step}
              className={`w-full text-left text-[11px] transition ${i === step ? 'text-forest' : i < step ? 'text-gold-dark hover:text-forest' : 'text-muted/60'}`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className={`mb-1 grid h-5 w-5 place-items-center rounded-full text-[10px] ${i <= step ? 'bg-forest text-gold' : 'bg-forest/10 text-muted'}`}>
                {i < step ? <Check size={10} /> : i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepHeading({ title, description }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
    </div>
  );
}

function Field({ label, htmlFor, children, hint }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-forest/70">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function StepCategory({ value, onSelect }) {
  return (
    <>
      <StepHeading title="What are you selling?" description="Choose the category that best describes your piece. This shapes the questions we ask next." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const Icon = categoryIcons[c.id];
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(c.id)}
              className={`group flex flex-col items-start gap-6 rounded-3xl border p-6 text-left transition-all duration-500 ${
                active ? 'border-forest bg-forest text-ivory shadow-soft' : 'border-forest/10 bg-white hover:-translate-y-0.5 hover:border-gold hover:shadow-soft'
              }`}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-full ${active ? 'bg-gold text-charcoal' : 'bg-gold/15 text-gold-dark'}`}>
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-serif text-xl">{c.name}</span>
                <span className={`mt-1 block text-xs ${active ? 'text-ivory/60' : 'text-muted'}`}>{c.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepBrand({ draft, update }) {
  const titleFromModel = (brand, model) => [brand, model].filter(Boolean).join(' ');
  return (
    <>
      <StepHeading title="Brand and model" description="Accurate naming helps buyers find your piece and builds trust from the first view." />
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Brand" htmlFor="brand">
          <input
            id="brand"
            list="brand-options"
            value={draft.brand}
            onChange={(e) => {
              const brand = e.target.value;
              update({ brand, title: draft.title || titleFromModel(brand, draft.model) });
            }}
            placeholder="e.g. Ferrari"
            className="input-lux"
          />
          <datalist id="brand-options">
            {allBrands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </Field>
        <Field label="Model or reference" htmlFor="model">
          <input
            id="model"
            value={draft.model}
            onChange={(e) => update({ model: e.target.value })}
            placeholder="e.g. Road Glide Special"
            className="input-lux"
          />
        </Field>
        <Field label="Year" htmlFor="year" hint="Four-digit year of manufacture.">
          <input
            id="year"
            inputMode="numeric"
            maxLength={4}
            value={draft.year}
            onChange={(e) => update({ year: e.target.value.replace(/\D/g, '') })}
            placeholder="2021"
            className="input-lux"
          />
        </Field>
        <Field label="City" htmlFor="location">
          <input id="location" value={draft.location} onChange={(e) => update({ location: e.target.value })} placeholder="e.g. Milan, Italy" className="input-lux" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Listing title" htmlFor="title" hint="Shown on cards and search results.">
            <input id="title" value={draft.title} onChange={(e) => update({ title: e.target.value })} className="input-lux" />
          </Field>
        </div>
      </div>
    </>
  );
}

function StepPhotos({ draft, update }) {
  const inputRef = useRef(null);

  const addFiles = (files) => {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const room = MAX_PHOTOS - draft.photos.length;
    const next = images.slice(0, room).map((f) => ({ id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`, url: URL.createObjectURL(f), name: f.name }));
    update({ photos: [...draft.photos, ...next] });
  };

  const remove = (id) => {
    const target = draft.photos.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    update({ photos: draft.photos.filter((p) => p.id !== id) });
  };

  return (
    <>
      <StepHeading title="Photographs" description={`Add up to ${MAX_PHOTOS} images. Lead with a three-quarter view, then show details, condition and any documentation. Photos stay on this device.`} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        className="group flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-forest/25 bg-white px-8 py-14 text-center transition-all duration-500 hover:border-gold hover:bg-gold/5"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-gold transition-transform duration-500 group-hover:-translate-y-1">
          <Upload size={20} />
        </span>
        <span className="font-serif text-xl text-forest">Drop photos here, or browse</span>
        <span className="text-xs text-muted">JPG or PNG · {draft.photos.length} of {MAX_PHOTOS} added</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} aria-label="Upload photos" />

      {draft.photos.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {draft.photos.map((p, i) => (
            <li key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-forest/5">
              <img src={p.url} alt={`Upload ${i + 1}: ${p.name}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-charcoal/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold">Cover</span>}
              <button
                type="button"
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name}`}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ivory/95 text-forest opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 flex items-center gap-2 text-xs text-muted">
        <Camera size={13} /> Previews only. Images are not uploaded in this prototype.
      </p>
    </>
  );
}

function StepSpecs({ fields, draft, update }) {
  return (
    <>
      <StepHeading title="Specifications" description="These details appear in the specification table on your listing. Be precise; buyers compare them carefully." />
      <div className="grid gap-7 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f} label={f} htmlFor={`spec-${slugify(f)}`}>
            <input
              id={`spec-${slugify(f)}`}
              value={draft.specs[f] || ''}
              onChange={(e) => update({ specs: { ...draft.specs, [f]: e.target.value } })}
              className="input-lux"
            />
          </Field>
        ))}
      </div>
    </>
  );
}

function StepCondition({ draft, update }) {
  return (
    <>
      <StepHeading title="Condition" description="Select the grade that matches your piece. Describe any wear, repairs or missing items in the note." />
      <div role="radiogroup" aria-label="Condition" className="grid gap-3">
        {CONDITIONS.map((c) => {
          const active = draft.condition === c;
          return (
            <button
              key={c}
              role="radio"
              aria-checked={active}
              type="button"
              onClick={() => update({ condition: c })}
              className={`flex items-center justify-between gap-6 rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                active ? 'border-forest bg-forest text-ivory' : 'border-forest/10 bg-white hover:border-gold'
              }`}
            >
              <span>
                <span className="block font-serif text-lg">{c}</span>
                <span className={`mt-1 block text-xs ${active ? 'text-ivory/60' : 'text-muted'}`}>{CONDITION_NOTES[c]}</span>
              </span>
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${active ? 'border-gold bg-gold text-charcoal' : 'border-forest/20'}`}>
                {active && <Check size={13} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-8">
        <Field label="Condition note (optional)" htmlFor="cond-note">
          <textarea id="cond-note" rows={3} value={draft.conditionNote} onChange={(e) => update({ conditionNote: e.target.value })} className="input-lux resize-none" placeholder="e.g. Two light scratches on the clasp; box included." />
        </Field>
      </div>
    </>
  );
}

function StepPrice({ draft, update, categoryId, products }) {
  const [insight, setInsight] = useState('idle');

  useEffect(() => {
    if (!Number(draft.price)) return undefined;
    setInsight('loading');
    const t = setTimeout(() => setInsight('ready'), 900);
    return () => clearTimeout(t);
  }, [draft.price]);

  const comparables = products.filter((p) => p.category === categoryId && p.status === 'active' && !p.isAuction);
  const average = comparables.length ? Math.round(comparables.reduce((s, p) => s + p.price, 0) / comparables.length) : null;

  return (
    <>
      <StepHeading title="Asking price" description="Set a price you would accept from a serious buyer. Offers are expected, so consider a small margin." />
      <div className="max-w-md">
        <Field label="Asking price (USD)" htmlFor="price">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-serif text-xl text-muted">$</span>
            <input
              id="price"
              inputMode="numeric"
              value={draft.price}
              onChange={(e) => update({ price: e.target.value.replace(/\D/g, '') })}
              className="input-lux !pl-9 font-serif text-2xl"
              placeholder="0"
            />
          </div>
        </Field>
      </div>

      {Number(draft.price) > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 max-w-xl rounded-3xl bg-white p-7 ring-1 ring-forest/5">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-dark">
            <Sparkles size={14} /> Price insight (sample data)
          </p>
          {insight === 'loading' ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <Loader2 size={14} className="animate-spin" /> Comparing with similar listings…
            </p>
          ) : average ? (
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-forest/85">
              <p>
                Comparable listings in this category average <strong className="font-serif text-lg font-normal text-forest">{formatPrice(average)}</strong>, across {comparables.length} sample listings.
              </p>
              <p className="text-muted">
                Your price is {Number(draft.price) > average ? `${Math.round(((Number(draft.price) - average) / average) * 100)}% above` : `${Math.round(((average - Number(draft.price)) / average) * 100)}% below`} that average. This is a demonstration insight, not a valuation.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No comparable listings are available for this category yet.</p>
          )}
        </motion.div>
      )}
    </>
  );
}

function StepDescription({ draft, update }) {
  const [drafting, setDrafting] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const category = categoryById(draft.categoryId);
  const generate = () => {
    setDrafting(true);
    timerRef.current = setTimeout(() => {
      const specLines = Object.entries(draft.specs)
        .filter(([, v]) => v)
        .slice(0, 3)
        .map(([k, v]) => `${k.toLowerCase()} ${v}`)
        .join(', ');
      const text = `${draft.year} ${draft.brand} ${draft.model}, offered in ${draft.condition?.toLowerCase() || 'good'} condition. ${
        draft.conditionNote || CONDITION_NOTES[draft.condition] || ''
      } Key details: ${specLines || 'available on request'}. A considered ${category?.name.toLowerCase() || 'piece'} from a private owner, presented with honest description and photographs.`;
      update({ description: text });
      setDrafting(false);
    }, 1600);
  };

  return (
    <>
      <StepHeading title="Description" description="Tell the story of your piece: its history, how it has been used, and what is included. At least 40 characters." />
      <div className="rounded-3xl bg-gold/10 p-5 ring-1 ring-gold/25">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-gold-dark" />
            <div>
              <p className="font-medium text-forest">Listing assistant</p>
              <p className="text-xs text-muted">Drafts a starting point from your details. Edit freely before publishing.</p>
            </div>
          </div>
          <button type="button" onClick={generate} disabled={drafting} className="btn-primary !py-2.5 !text-xs">
            {drafting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Drafting…
              </>
            ) : (
              <>
                <Sparkles size={14} /> Draft with assistant
              </>
            )}
          </button>
        </div>
      </div>
      <div className="mt-6">
        <textarea
          aria-label="Listing description"
          rows={9}
          maxLength={1200}
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          className="input-lux resize-none leading-relaxed"
          placeholder="Describe your piece…"
        />
        <div className="mt-2 flex justify-between text-xs">
          <span className={draft.description.trim().length >= 40 || !draft.description ? 'text-muted' : 'text-red-700'}>
            {draft.description.trim().length}/40 minimum
          </span>
          <span className="text-muted">{draft.description.length}/1200</span>
        </div>
      </div>
    </>
  );
}

function StepPreview({ draft, category, specFields }) {
  const cover = draft.photos[0]?.url;
  return (
    <>
      <StepHeading title="Preview your listing" description="This is how buyers will encounter your piece. Your listing will be marked as seller-declared until reviewed." />
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-forest/5">
            <ImageWithFallback src={cover} alt={draft.title} label={draft.brand} className="h-full w-full object-cover" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <AuthenticityBadge status="seller-declared" />
            {draft.condition && <ConditionBadge condition={draft.condition} />}
          </div>
        </div>
        <div>
          <p className="eyebrow">{draft.brand}</p>
          <h3 className="mt-3 text-3xl leading-tight">{draft.title}</h3>
          <p className="mt-3 text-sm text-muted">
            {category?.name} · {draft.year} · {draft.location}
          </p>
          <p className="mt-8 font-serif text-4xl text-forest">{draft.price ? formatPrice(Number(draft.price)) : '—'}</p>

          <p className="mt-8 text-sm leading-relaxed text-muted">{draft.description}</p>

          <dl className="mt-8 divide-y divide-forest/10 border-y border-forest/10 text-sm">
            {specFields.map((f) => (
              <div key={f} className="grid grid-cols-[150px_1fr] gap-4 py-3">
                <dt className="text-muted">{f}</dt>
                <dd className="text-forest">{draft.specs[f]}</dd>
              </div>
            ))}
          </dl>
          <SampleNotice className="mt-8" />
        </div>
      </div>
    </>
  );
}
