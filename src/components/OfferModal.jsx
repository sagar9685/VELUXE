import { useState } from 'react';
import Modal from './Modal';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice } from '../lib/format';

const PRESETS = [0.9, 0.95, 0.98];

export default function OfferModal({ open, onClose, product }) {
  const { submitOffer } = useMarketplace();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!product) return null;

  const numeric = Number(amount);
  const ratio = numeric > 0 ? numeric / product.price : 0;

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numeric || numeric <= 0) {
      setError('Enter an amount to offer.');
      return;
    }
    if (numeric > product.price) {
      setError('Your offer is above the asking price. Consider contacting the seller instead.');
      return;
    }
    submitOffer({ product, amount: numeric, note: note.trim() });
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Make an offer"
      subtitle={`${product.title} · asking ${formatPrice(product.price)}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="offer-amount" className="text-xs font-medium uppercase tracking-[0.18em] text-forest/70">
            Your offer (USD)
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg text-muted">$</span>
            <input
              id="offer-amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^\d]/g, ''));
                setError('');
              }}
              placeholder={Math.round(product.price * 0.95).toLocaleString('en-US')}
              className="input-lux !pl-9 font-serif text-xl"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'offer-error' : 'offer-hint'}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(String(Math.round(product.price * p)))}
                className="chip"
              >
                {Math.round(p * 100)}% · {formatPrice(Math.round(product.price * p))}
              </button>
            ))}
          </div>
          {error ? (
            <p id="offer-error" className="mt-3 text-xs text-red-700">
              {error}
            </p>
          ) : (
            <p id="offer-hint" className="mt-3 text-xs text-muted">
              {numeric > 0
                ? ratio < 0.7
                  ? 'Offers well below asking are rarely accepted. A respectful opening is usually 90–95%.'
                  : `This offer is ${Math.round(ratio * 100)}% of the asking price.`
                : 'The seller receives your offer with your note and contact details.'}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="offer-note" className="text-xs font-medium uppercase tracking-[0.18em] text-forest/70">
            Note to seller <span className="normal-case tracking-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="offer-note"
            rows={3}
            maxLength={400}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Available for collection this month. Happy to arrange a viewing."
            className="input-lux mt-2 resize-none"
          />
        </div>

        <div className="rounded-2xl bg-forest/5 p-4 text-xs leading-relaxed text-forest/75">
          Offers are not binding in this demo. No payment is taken and no seller is contacted.
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Send offer
          </button>
        </div>
      </form>
    </Modal>
  );
}
