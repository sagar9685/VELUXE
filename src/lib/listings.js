export const CONDITIONS = ['New', 'Like New', 'Excellent', 'Very Good', 'Good'];

export const PRICE_RANGES = [
  { id: 'any', label: 'Any price', min: 0, max: Infinity },
  { id: 'under-1k', label: 'Under $1,000', min: 0, max: 1000 },
  { id: '1k-10k', label: '$1,000 – $10,000', min: 1000, max: 10000 },
  { id: '10k-50k', label: '$10,000 – $50,000', min: 10000, max: 50000 },
  { id: '50k-plus', label: '$50,000 and above', min: 50000, max: Infinity },
];

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

export const emptyFilters = {
  q: '',
  categories: [],
  brands: [],
  conditions: [],
  priceRange: 'any',
  verifiedOnly: false,
  auctionOnly: false,
  collection: '',
  sort: 'relevance',
};

/** Reads initial filter state from a URL query string. */
export function parseFilters(search, collections = []) {
  const params = new URLSearchParams(search);
  const filters = { ...emptyFilters };
  if (params.get('q')) filters.q = params.get('q');
  if (params.get('category')) filters.categories = [params.get('category')];
  if (params.get('brand')) filters.brands = [params.get('brand')];
  if (params.get('auction') === '1') filters.auctionOnly = true;
  if (params.get('verified') === '1') filters.verifiedOnly = true;
  if (params.get('sort')) filters.sort = params.get('sort');
  const collectionId = params.get('collection');
  if (collectionId && collections.some((c) => c.id === collectionId)) {
    filters.collection = collectionId;
  }
  return filters;
}

export function countActiveFilters(f) {
  let n = 0;
  n += f.categories.length;
  n += f.brands.length;
  n += f.conditions.length;
  if (f.priceRange !== 'any') n += 1;
  if (f.verifiedOnly) n += 1;
  if (f.auctionOnly) n += 1;
  if (f.collection) n += 1;
  return n;
}

/** Applies search, filters and sorting to a product list. */
export function applyFilters(products, filters, collections = []) {
  const q = filters.q.trim().toLowerCase();
  const range = PRICE_RANGES.find((r) => r.id === filters.priceRange) || PRICE_RANGES[0];
  const collection = collections.find((c) => c.id === filters.collection);

  const scored = products
    .filter((p) => p.status === 'active')
    .filter((p) => !filters.categories.length || filters.categories.includes(p.category))
    .filter((p) => !filters.brands.length || filters.brands.includes(p.brand))
    .filter((p) => !filters.conditions.length || filters.conditions.includes(p.condition))
    .filter((p) => p.price >= range.min && p.price < range.max)
    .filter((p) => !filters.verifiedOnly || p.verified)
    .filter((p) => !filters.auctionOnly || p.isAuction)
    .filter((p) => !collection || (p.tags || []).includes(collection.tag))
    .map((p) => {
      let score = 0;
      if (q) {
        const haystack = [p.title, p.brand, p.model, p.location, ...(p.tags || [])]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return null;
        if (p.title.toLowerCase().includes(q)) score += 3;
        if (p.brand.toLowerCase().includes(q)) score += 2;
        if (p.location.toLowerCase().includes(q)) score += 1;
      }
      if (p.featured) score += 1;
      return { p, score };
    })
    .filter(Boolean);

  const sorted = scored.sort((a, b) => {
    switch (filters.sort) {
      case 'newest':
        return new Date(b.p.listedAt) - new Date(a.p.listedAt);
      case 'price-asc':
        return a.p.price - b.p.price;
      case 'price-desc':
        return b.p.price - a.p.price;
      default:
        return b.score - a.score;
    }
  });

  return sorted.map((s) => s.p);
}
