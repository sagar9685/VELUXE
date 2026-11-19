import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Toaster() {
  const { toast, clearToast } = useMarketplace();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(clearToast, 3200);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex justify-center px-4 sm:top-24">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-forest px-5 py-3 text-sm text-ivory shadow-soft"
          >
            {toast.tone === 'info' ? (
              <Info size={17} className="text-gold" aria-hidden="true" />
            ) : (
              <CheckCircle2 size={17} className="text-gold" aria-hidden="true" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
