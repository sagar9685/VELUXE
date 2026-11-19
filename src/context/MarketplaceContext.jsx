import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedProducts } from '../data/products';
import { buyerProfile, seedInquiries, seedNotifications, seedOffers } from '../data/account';
import { formatPrice } from '../lib/format';
import { sellers } from '../data/sellers';

const MarketplaceContext = createContext(null);
const FAVORITES_KEY = 'veluxe:favorites';
const MAX_COMPARE = 3;

function loadFavorites() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function MarketplaceProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [compare, setCompare] = useState([]);
  const [offers, setOffers] = useState(seedOffers);
  const [inquiries, setInquiries] = useState(seedInquiries);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(buyerProfile);
  const [customSellerName] = useState(() => sellers.find((s) => s.id === 's-you')?.studio);
  const viewedRef = useRef(new Set());

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable: favourites stay in memory */
    }
  }, [favorites]);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const pushNotification = useCallback((note) => {
    setNotifications((prev) => [
      { id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, read: false, time: new Date().toISOString(), ...note },
      ...prev,
    ]);
  }, []);

  /* ---------- Favourites / wishlist ---------- */
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id) => {
      const wasSaved = favorites.includes(id);
      setFavorites((prev) => (wasSaved ? prev.filter((x) => x !== id) : [...prev, id]));
      showToast(wasSaved ? 'Removed from your wishlist' : 'Saved to your wishlist');
    },
    [favorites, showToast],
  );

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((x) => x !== id));
  }, []);

  /* ---------- Comparison ---------- */
  const toggleCompare = useCallback(
    (id) => {
      if (compare.includes(id)) {
        setCompare((prev) => prev.filter((x) => x !== id));
        return;
      }
      if (compare.length >= MAX_COMPARE) {
        showToast(`You can compare up to ${MAX_COMPARE} listings at once`, 'info');
        return;
      }
      setCompare((prev) => [...prev, id]);
    },
    [compare, showToast],
  );

  const clearCompare = useCallback(() => setCompare([]), []);

  /* ---------- Listings ---------- */
  const getProduct = useCallback((id) => products.find((p) => p.id === id), [products]);

  const recordView = useCallback((id) => {
    if (viewedRef.current.has(id)) return;
    viewedRef.current.add(id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)));
  }, []);

  const setListingStatus = useCallback(
    (id, status) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      const labels = { active: 'Listing is live', paused: 'Listing paused', sold: 'Marked as sold' };
      showToast(labels[status] || 'Listing updated');
    },
    [showToast],
  );

  const removeListing = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Listing removed', 'info');
    },
    [showToast],
  );

  const publishListing = useCallback(
    (draft) => {
      const id = `vx-new-${Date.now().toString(36)}`;
      const product = {
        ...draft,
        id,
        status: 'active',
        listedAt: new Date().toISOString(),
        views: 0,
        inquiries: 0,
        verified: false,
        authenticity: 'seller-declared',
        sellerId: 's-you',
        featured: false,
        isSample: false,
      };
      setProducts((prev) => [product, ...prev]);
      pushNotification({
        type: 'listing',
        title: 'Listing published',
        body: `${product.title} is now live in the demo marketplace.`,
      });
      return product;
    },
    [pushNotification],
  );

  /* ---------- Offers & inquiries ---------- */
  const submitOffer = useCallback(
    ({ product, amount, note }) => {
      const offer = {
        id: `o-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        askingPrice: product.price,
        amount,
        note,
        status: 'Sent',
        createdAt: new Date().toISOString(),
      };
      setOffers((prev) => [offer, ...prev]);
      pushNotification({
        type: 'offer',
        title: 'Offer sent',
        body: `Your offer of ${formatPrice(amount)} for ${product.title} was sent to the seller.`,
      });
      showToast('Offer sent to the seller (demo)');
      return offer;
    },
    [pushNotification, showToast],
  );

  const sendInquiry = useCallback(
    ({ product, message }) => {
      const seller = sellers.find((s) => s.id === product.sellerId);
      const inquiry = {
        id: `i-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        sellerName: seller?.name || 'Seller',
        message,
        status: 'Awaiting reply',
        createdAt: new Date().toISOString(),
      };
      setInquiries((prev) => [inquiry, ...prev]);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inquiries: (p.inquiries || 0) + 1 } : p)),
      );
      pushNotification({
        type: 'inquiry',
        title: 'Message sent',
        body: `Your message about ${product.title} was delivered to ${seller?.name || 'the seller'}.`,
      });
      showToast('Message sent to the seller (demo)');
      return inquiry;
    },
    [pushNotification, showToast],
  );

  /* ---------- Notifications ---------- */
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => ({ ...prev, ...patch }));
      showToast('Profile updated');
    },
    [showToast],
  );

  const value = useMemo(
    () => ({
      products,
      getProduct,
      recordView,
      setListingStatus,
      removeListing,
      publishListing,
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      compare,
      toggleCompare,
      clearCompare,
      maxCompare: MAX_COMPARE,
      offers,
      submitOffer,
      inquiries,
      sendInquiry,
      notifications,
      unreadCount,
      markAllRead,
      markRead,
      dismissNotification,
      pushNotification,
      toast,
      showToast,
      clearToast,
      user,
      updateUser,
      sellerStudioName: customSellerName,
    }),
    [
      products,
      getProduct,
      recordView,
      setListingStatus,
      removeListing,
      publishListing,
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      compare,
      toggleCompare,
      clearCompare,
      offers,
      submitOffer,
      inquiries,
      sendInquiry,
      notifications,
      unreadCount,
      markAllRead,
      markRead,
      dismissNotification,
      pushNotification,
      toast,
      showToast,
      clearToast,
      user,
      updateUser,
      customSellerName,
    ],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside <MarketplaceProvider>');
  return ctx;
}
