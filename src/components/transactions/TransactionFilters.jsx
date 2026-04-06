import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, Calendar, DollarSign, Tag } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { categoryColors, categoryIcons } from '../../data/mockTransactions';

/* ─── small helpers ─── */
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg bg-accent-light text-accent text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-accent-dark transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}

export default function TransactionFilters() {
  const {
    search, setSearch,
    typeFilter, setTypeFilter,
    groupBy, setGroupBy,
    advancedOpen, setAdvancedOpen,
    activeAdvancedCount,
    allCategories,
    categories, toggleCategory,
    dateFrom, setDateFrom,
    dateTo,   setDateTo,
    amountMin, setAmountMin,
    amountMax, setAmountMax,
    clearAdvanced,
  } = useApp();

  const TYPE_OPTS  = ['all', 'income', 'expense'];
  const GROUP_OPTS = [
    { value: 'none',     label: 'No grouping' },
    { value: 'month',    label: 'By month' },
    { value: 'category', label: 'By category' },
    { value: 'type',     label: 'By type' },
  ];

  return (
    <div className="space-y-3">
      {/* ── Row 1: search + type pills + advanced toggle ── */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light dark:text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search description, category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink dark:text-ink-muted dark:hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1 bg-surface dark:bg-surface-border-dark rounded-xl p-1 shrink-0">
          {TYPE_OPTS.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200
                ${typeFilter === t
                  ? 'bg-white dark:bg-surface-card-dark shadow-card text-ink dark:text-white'
                  : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Group-by select */}
        <div className="relative shrink-0">
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            className="input-field pr-8 appearance-none cursor-pointer text-xs"
          >
            {GROUP_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setAdvancedOpen(o => !o)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0
            ${advancedOpen || activeAdvancedCount > 0
              ? 'border-accent bg-accent-light text-accent'
              : 'border-gray-200 dark:border-surface-border-dark text-ink-muted dark:text-ink-light hover:border-accent hover:text-accent'}`}
        >
          <SlidersHorizontal size={13} />
          Filters
          {activeAdvancedCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center">
              {activeAdvancedCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Advanced filter panel (animated) ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
          ${advancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-surface dark:bg-surface-border-dark/40 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-surface-border-dark">
          
          {/* Categories multiselect */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={12} className="text-ink-muted" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-light">Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allCategories.map(cat => {
                const active = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150
                      ${active
                        ? 'text-white shadow-sm'
                        : 'bg-white dark:bg-surface-card-dark text-ink dark:text-white border border-gray-200 dark:border-surface-border-dark hover:border-accent hover:text-accent'}`}
                    style={active ? { backgroundColor: categoryColors[cat] || '#94A3B8' } : undefined}
                  >
                    <span>{categoryIcons[cat] || '💰'}</span>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date range */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={12} className="text-ink-muted" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-light">Date Range</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-ink-muted dark:text-ink-light mb-1 block">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-muted dark:text-ink-light mb-1 block">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Amount range */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign size={12} className="text-ink-muted" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-light">Amount Range</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-ink-muted dark:text-ink-light mb-1 block">Min ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={amountMin || ''}
                  onChange={e => setAmountMin(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-ink-muted dark:text-ink-light mb-1 block">Max ($)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="No limit"
                  value={amountMax || ''}
                  onChange={e => setAmountMax(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Clear button */}
          {activeAdvancedCount > 0 && (
            <button
              onClick={clearAdvanced}
              className="text-xs font-semibold text-expense hover:text-expense-dark transition-colors flex items-center gap-1"
            >
              <X size={11} /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeAdvancedCount > 0 && !advancedOpen && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <FilterChip key={c} label={c} onRemove={() => toggleCategory(c)} />
          ))}
          {(dateFrom || dateTo) && (
            <FilterChip
              label={`${dateFrom || '…'} → ${dateTo || '…'}`}
              onRemove={() => { setDateFrom(''); setDateTo(''); }}
            />
          )}
          {(amountMin > 0 || amountMax > 0) && (
            <FilterChip
              label={`$${amountMin}–${amountMax || '∞'}`}
              onRemove={() => { setAmountMin(0); setAmountMax(0); }}
            />
          )}
        </div>
      )}
    </div>
  );
}
