import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../../context/useApp';

export default function TransactionFilters() {
  const { search, setSearch, typeFilter, setTypeFilter } = useApp();

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light dark:text-ink-muted" />
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink dark:text-ink-muted dark:hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 bg-surface dark:bg-surface-border-dark rounded-xl p-1">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`
              px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${typeFilter === f.value
                ? 'bg-white dark:bg-surface-card-dark shadow-card text-ink dark:text-white'
                : 'text-ink-muted dark:text-ink-light hover:text-ink dark:hover:text-white'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
