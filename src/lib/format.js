import { SITE } from '../config/site';

export function formatPrice(value, currency = SITE.currency) {
  return new Intl.NumberFormat(SITE.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(SITE.locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(iso) {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const hours = Math.round(diffMin / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

export function formatCountdown(ms) {
  if (ms <= 0) return 'Ended';
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
}

export function daysAgo(days) {
  return new Date(Date.now() - days * 86400 * 1000).toISOString();
}
