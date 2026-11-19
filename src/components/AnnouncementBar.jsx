import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '../config/site';

export default function AnnouncementBar() {
  const messages = SITE.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 5200);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative z-[60] overflow-hidden bg-charcoal px-4 py-2.5 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] tracking-[0.16em] text-gold sm:text-xs"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
