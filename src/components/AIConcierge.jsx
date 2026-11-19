import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

/**
 * Mock AI concierge. Responses are scripted from keyword rules — no model or
 * network call is made. It demonstrates the conversational interaction only.
 */
const PROMPTS = [
  'How does authenticity review work?',
  'Find me a Ferrari jacket',
  'What should I offer for a used watch?',
  'How do auctions work?',
];

function respond(input) {
  const q = input.toLowerCase();
  if (/authentic|genuine|fake|real/.test(q)) {
    return {
      text:
        'VELUXE Verified listings are reviewed by our Authenticity Desk, which checks documentation, serial or reference numbers and condition. Listings marked “Seller-declared” have not been reviewed by us. This prototype shows the statuses only; no real review takes place here.',
      link: { to: '/explore?verified=1', label: 'Browse verified listings' },
    };
  }
  if (/ferrari|jacket|lifestyle/.test(q)) {
    return {
      text: 'Our Ferrari lifestyle pieces are concentrated in the Team Bomber and collectibles. The Scuderia Team Bomber Jacket is in Like New condition.',
      link: { to: '/explore?brand=Ferrari', label: 'See Ferrari listings' },
    };
  }
  if (/offer|price|worth|value|negotiat/.test(q)) {
    return {
      text: 'For a pre-owned watch or bag in good condition, a respectful opening offer is usually 90–95% of asking. Pieces with papers and box often hold value better. Share the reference and condition with the seller and ask for their best.',
    };
  }
  if (/auction|bid/.test(q)) {
    return {
      text: 'Selected listings run timed auctions. Bids are shown with a live countdown, and the highest bid at close is offered to the seller. Auctions in this demo are simulated and no bids are placed.',
      link: { to: '/explore?auction=1', label: 'View auctions' },
    };
  }
  return {
    text: 'I can help you find a listing, explain how authenticity is reviewed, suggest an offer or walk you through selling. What are you looking for today?',
  };
}

export default function AIConcierge() {
  const { products } = useMarketplace();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Good day. I am the VELUXE concierge. Ask me about a listing, authenticity or how to sell.',
    },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const ask = (question) => {
    const text = question.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    const t = setTimeout(() => {
      const reply = respond(text);
      setMessages((m) => [...m, { role: 'assistant', ...reply }]);
      setTyping(false);
    }, 900);
    timersRef.current.push(t);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[45] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="VELUXE concierge"
            className="flex h-[min(560px,70vh)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl bg-ivory shadow-soft ring-1 ring-forest/10"
          >
            <div className="flex items-center justify-between bg-forest px-5 py-4 text-ivory">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 text-gold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="font-serif text-base">Concierge</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/50">Demo assistant</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close concierge" className="rounded-full p-1.5 text-ivory/70 transition hover:text-gold">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === 'user' ? 'rounded-br-md bg-forest text-ivory' : 'rounded-bl-md bg-white text-charcoal ring-1 ring-forest/5'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.link && (
                    <Link to={m.link.to} className="mt-2 text-xs font-medium text-gold-dark underline-offset-4 hover:underline">
                      {m.link.label} →
                    </Link>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 ring-1 ring-forest/5 w-fit" aria-label="Concierge is typing">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-gold-dark"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-forest/10 px-4 py-3">
              <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
                {PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => ask(p)} disabled={typing} className="chip shrink-0 !px-3 !py-1.5 text-[11px] disabled:opacity-50">
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2 rounded-full border border-forest/15 bg-white py-1.5 pl-4 pr-1.5 focus-within:border-gold"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the concierge…"
                  aria-label="Message the concierge"
                  className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
                />
                <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid h-9 w-9 place-items-center rounded-full bg-forest text-ivory transition hover:bg-gold hover:text-charcoal disabled:opacity-40">
                  <Send size={14} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-muted">{products.length} sample listings available</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex items-center gap-2.5 rounded-full bg-forest px-5 py-3.5 text-sm text-ivory shadow-soft transition-all duration-500 hover:bg-charcoal hover:shadow-gold"
      >
        <Sparkles size={16} className="text-gold transition-transform duration-500 group-hover:rotate-12" aria-hidden="true" />
        {open ? 'Close' : 'Ask VELUXE'}
      </button>
    </div>
  );
}
