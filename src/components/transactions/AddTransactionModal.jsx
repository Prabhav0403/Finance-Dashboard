import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/useApp';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Food', 'Travel', 'Shopping', 'Entertainment', 'Utilities', 'Health'];

const INITIAL = { description: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] };

export default function AddTransactionModal() {
  const { addTransaction, role } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  if (role !== 'admin') return null;

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addTransaction(form);
    setForm(INITIAL);
    setErrors({});
    setOpen(false);
  }

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={15} />
        Add Transaction
      </Button>

      <Modal isOpen={open} onClose={() => { setOpen(false); setErrors({}); setForm(INITIAL); }} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Description</label>
            <input
              className={`input-field ${errors.description ? 'border-expense/50 ring-2 ring-expense/10' : ''}`}
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
            {errors.description && <p className="text-xs text-expense mt-1">{errors.description}</p>}
          </div>

          {/* Amount + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`input-field ${errors.amount ? 'border-expense/50 ring-2 ring-expense/10' : ''}`}
                placeholder="0.00"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
              />
              {errors.amount && <p className="text-xs text-expense mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted dark:text-ink-light mb-1.5 uppercase tracking-wider">Type</label>
              <div className="flex gap-1.5 bg-surface dark:bg-surface-border-dark rounded-xl p-1">
                {['expense', 'income'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleChange('type', t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-income-light text-income-dark shadow'
                          : 'bg-expense-light text-expense-dark shadow'
                        : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'
                    }`}
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
            <select
              className="input-field"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
            >
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
              onChange={e => handleChange('date', e.target.value)}
            />
            {errors.date && <p className="text-xs text-expense mt-1">{errors.date}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setOpen(false); setForm(INITIAL); setErrors({}); }}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
