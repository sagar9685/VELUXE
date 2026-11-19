import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pause, Play, Plus, MessageCircle, Package, Trash2, TrendingUp, CheckCircle2 } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import EmptyState from '../components/EmptyState';
import SampleNotice from '../components/SampleNotice';
import { useMarketplace } from '../context/MarketplaceContext';
import { sampleRevenueByMonth } from '../data/account';
import { formatPrice, timeAgo } from '../lib/format';

const SELLER_ID = 's-you';

const STATUS_STYLES = {
  active: 'bg-gold/15 text-gold-dark ring-gold/40',
  paused: 'bg-stone-100 text-charcoal ring-forest/10',
  sold: 'bg-forest text-ivory ring-forest',
};

export default function SellerDashboard() {
  const { products, inquiries, setListingStatus, removeListing } = useMarketplace();
  const [confirmId, setConfirmId] = useState(null);

  const mine = useMemo(() => products.filter((p) => p.sellerId === SELLER_ID), [products]);
  const active = mine.filter((p) => p.status === 'active');
  const totalViews = mine.reduce((s, p) => s + (p.views || 0), 0);
  const totalInquiries = mine.reduce((s, p) => s + (p.inquiries || 0), 0);
  const revenue = sampleRevenueByMonth.reduce((s, m) => s + m.value, 0);

  const kpis = [
    { label: 'Revenue, 12 months', value: formatPrice(revenue), note: 'Sample data', icon: TrendingUp },
    { label: 'Active listings', value: active.length, note: `${mine.length} in total`, icon: Package },
    { label: 'Views', value: totalViews.toLocaleString('en-US'), note: 'Sample data', icon: Eye },
    { label: 'Inquiries', value: totalInquiries, note: `${inquiries.length} messages sent`, icon: MessageCircle },
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-6 pb-28 pt-14 lg:px-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Seller studio</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">Your listings</h1>
          <p className="mt-4 max-w-xl text-sm text-muted">Manage availability, follow interest and track results for the pieces you have on the market.</p>
        </div>
        <Link to="/sell" className="btn-primary self-start sm:self-auto">
          <Plus size={16} /> Create listing
        </Link>
      </header>

      <div className="mt-10">
        <SampleNotice />
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-lux p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{k.label}</p>
              <k.icon size={16} className="text-gold-dark" aria-hidden="true" />
            </div>
            <p className="mt-4 font-serif text-3xl text-forest">{k.value}</p>
            <p className="mt-1 text-[11px] text-muted">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <RevenueChart />
        <RecentInquiries />
      </div>

      {/* Listing management */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl">Listing management</h2>
          <span className="text-xs text-muted">{mine.length} {mine.length === 1 ? 'listing' : 'listings'}</span>
        </div>

        {mine.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={Package}
              title="No listings yet"
              description="Create your first listing in a few guided steps. It will appear here for management."
              actionLabel="Create your first listing"
              actionTo="/sell"
            />
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-3xl bg-white ring-1 ring-forest/5">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-forest/10 text-[11px] uppercase tracking-[0.15em] text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Listing</th>
                  <th className="px-4 py-4 font-medium">Asking</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Views</th>
                  <th className="px-4 py-4 font-medium">Inquiries</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10">
                {mine.map((p) => {
                  const status = p.status || 'active';
                  const confirming = confirmId === p.id;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-ivory/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest/5">
                            <ImageWithFallback src={p.images?.[0]} alt="" label={p.brand} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <Link to={`/product/${p.id}`} className="block truncate font-serif text-base text-forest transition hover:text-gold-dark">
                              {p.title}
                            </Link>
                            <p className="mt-0.5 text-xs text-muted">Listed {timeAgo(p.listedAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-serif text-forest">{formatPrice(p.price)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium capitalize ring-1 ${STATUS_STYLES[status]}`}>{status}</span>
                      </td>
                      <td className="px-4 py-4 text-forest/80">{p.views}</td>
                      <td className="px-4 py-4 text-forest/80">{p.inquiries}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {status !== 'sold' && (
                            <button
                              type="button"
                              onClick={() => setListingStatus(p.id, status === 'active' ? 'paused' : 'active')}
                              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5 text-xs text-forest transition hover:border-gold hover:text-gold-dark"
                            >
                              {status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                              {status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          )}
                          {status !== 'sold' && (
                            <button
                              type="button"
                              onClick={() => setListingStatus(p.id, 'sold')}
                              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5 text-xs text-forest transition hover:border-gold hover:text-gold-dark"
                            >
                              <CheckCircle2 size={12} /> Mark sold
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirming) {
                                removeListing(p.id);
                                setConfirmId(null);
                              } else {
                                setConfirmId(p.id);
                              }
                            }}
                            onBlur={() => confirming && setConfirmId(null)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                              confirming ? 'bg-red-700 text-ivory' : 'text-muted hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            <Trash2 size={12} /> {confirming ? 'Confirm remove' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------ Revenue chart */

function RevenueChart() {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...sampleRevenueByMonth.map((m) => m.value));
  const width = 600;
  const height = 240;
  const barGap = 14;
  const barWidth = (width - barGap * (sampleRevenueByMonth.length - 1)) / sampleRevenueByMonth.length;

  return (
    <div className="card-lux p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Revenue overview</p>
          <p className="mt-2 font-serif text-2xl text-forest">
            {hovered ? `${hovered.month} · ${formatPrice(hovered.value)}` : 'Last 12 months'}
          </p>
        </div>
        <span className="rounded-full bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-gold-dark">Sample data</span>
      </div>

      <div className="mt-8">
        <svg viewBox={`0 0 ${width} ${height + 28}`} className="h-auto w-full" role="img" aria-label="Monthly revenue bar chart, sample data">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" x2={width} y1={height - height * f} y2={height - height * f} stroke="#19271F" strokeOpacity="0.07" />
          ))}
          {sampleRevenueByMonth.map((m, i) => {
            const h = (m.value / max) * height;
            const x = i * (barWidth + barGap);
            const isHover = hovered?.month === m.month;
            const isLast = i === sampleRevenueByMonth.length - 1;
            return (
              <g key={m.month} onMouseEnter={() => setHovered(m)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(m)} onBlur={() => setHovered(null)} tabIndex={0}>
                <rect x={x} y={0} width={barWidth} height={height} fill="transparent" />
                <rect
                  x={x}
                  y={height - h}
                  width={barWidth}
                  height={h}
                  rx="6"
                  fill={isLast || isHover ? '#C4A46A' : '#19271F'}
                  fillOpacity={isHover || isLast ? 1 : 0.85}
                  style={{ transition: 'fill 0.3s ease' }}
                />
                <text x={x + barWidth / 2} y={height + 20} textAnchor="middle" fontSize="13" fill="#8C8D86">
                  {m.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------- Recent inquiries */

function RecentInquiries() {
  const { inquiries } = useMarketplace();
  return (
    <div className="card-lux p-7">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Recent inquiries</p>
      {inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No inquiries yet. Buyers who message you will appear here.</p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/10">
          {inquiries.slice(0, 5).map((i) => (
            <li key={i.id} className="py-4">
              <p className="truncate font-serif text-base text-forest">{i.productTitle}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{i.message}</p>
              <p className="mt-2 text-[11px] text-muted/80">{timeAgo(i.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
