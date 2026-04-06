import { useState } from 'react';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const CATEGORIES = ['Salary','Freelance','Investment','Food','Travel','Shopping','Entertainment','Utilities','Health'];
const INITIAL = { description: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] };

export default function AddTransactionModal() {
  const { addTransaction, role, posting, postError } = useApp();
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState(INITIAL);
  const [errors, setErrors] = useState({});

  if (role !== 'admin') return null;

  function validate() {
    const e = {};
    if (!form.description.trim())                         e.description = 'Required';
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount';
    if (!form.date)                                       e.date = 'Required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addTransaction(form);
    // Modal stays open briefly to show spinner; close on success via useEffect-like approach
    // We'll close after a short delay matching the mock API (450ms)
    setTimeout(() => {
      setForm(INITIAL);
      setErrors({});
      setOpen(false);
    }, 520);
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  function handleClose() {
    if (posting) return; // Don't close during submit
    setOpen(false);
    setForm(INITIAL);
    setErrors({});
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={15} />
        Add Transaction
      </Button>

      <Modal isOpen={open} onClose={handleClose} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* API error */}
          {postError && (
            <div className="flex items-start gap-2 bg-expense-light text-expense-dark rounded-xl p-3 text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{postError}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Description</label>
            <input
              className={`input-field ${errors.description ? 'border-expense/50 ring-2 ring-expense/10' : ''}`}
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <p className="text-xs text-expense mt-1">{errors.description}</p>}
          </div>

          {/* Amount + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Amount ($)</label>
              <input
                type="number" min="0" step="0.01"
                className={`input-field ${errors.amount ? 'border-expense/50 ring-2 ring-expense/10' : ''}`}
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
              {errors.amount && <p className="text-xs text-expense mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Type</label>
              <div className="flex gap-1.5 bg-surface dark:bg-surface-border-dark rounded-xl p-1 h-[42px]">
                {['expense','income'].map(t => (
                  <button
                    key={t} type="button" onClick={() => set('type', t)}
                    className={`flex-1 rounded-lg text-xs font-semibold capitalize transition-all duration-200
                      ${form.type === t
                        ? t === 'income'
                          ? 'bg-income-light text-income-dark shadow'
                          : 'bg-expense-light text-expense-dark shadow'
                        : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Category</label>
            <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              className={`input-field ${errors.date ? 'border-expense/50 ring-2 ring-expense/10' : ''}`}
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
            {errors.date && <p className="text-xs text-expense mt-1">{errors.date}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleClose} disabled={posting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={posting}>
              {posting ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : (
                'Add Transaction'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
