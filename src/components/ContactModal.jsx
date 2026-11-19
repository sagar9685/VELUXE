import { useState } from 'react';
import Modal from './Modal';
import { useMarketplace } from '../context/MarketplaceContext';
import { sellerById, initialsOf } from '../data/sellers';
import ImageWithFallback from './ImageWithFallback';

const METHODS = [
  { id: 'in-app', label: 'In-app message' },
  { id: 'call', label: 'Request a call' },
  { id: 'viewing', label: 'Arrange a viewing' },
];

export default function ContactModal({ open, onClose, product }) {
  const { sendInquiry } = useMarketplace();
  const seller = product ? sellerById(product.sellerId) : null;
  const [method, setMethod] = useState('in-app');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!product || !seller) return null;

  const defaultMessage = `Hello ${seller.name.split(' ')[0]}, I'm interested in the ${product.title}. Could you share more details about its history?`;
  const body = message.trim() || defaultMessage;

  const handleClose = () => {
    setError('');
    setMessage('');
    onClose();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (body.length < 10) {
      setError('Please write a message of at least ten characters.');
      return;
    }
    const prefix = METHODS.find((m) => m.id === method)?.label;
    sendInquiry({ product, message: `[${prefix}] ${body}` });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Contact seller" subtitle="Your message is shared only with this seller.">
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-forest/5">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-forest">
          {seller.avatar ? (
            <ImageWithFallback src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" label="" />
          ) : (
            <div className="grid h-full w-full place-items-center font-serif text-gold">{initialsOf(seller.name)}</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-lg text-forest">{seller.studio}</p>
          <p className="text-xs text-muted">Re: {product.title}</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-6" noValidate>
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-[0.18em] text-forest/70">Preferred next step</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={method === m.id}
                onClick={() => setMethod(m.id)}
                className={`chip ${method === m.id ? 'chip-active' : ''}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="contact-message" className="text-xs font-medium uppercase tracking-[0.18em] text-forest/70">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            maxLength={800}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError('');
            }}
            placeholder={defaultMessage}
            className="input-lux mt-2 resize-none"
            aria-invalid={Boolean(error)}
          />
          <div className="mt-2 flex justify-between text-xs">
            <span className={error ? 'text-red-700' : 'text-muted'}>{error || 'Leave blank to send the suggested opening.'}</span>
            <span className="text-muted">{message.length}/800</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Send message
          </button>
        </div>
      </form>
    </Modal>
  );
}
