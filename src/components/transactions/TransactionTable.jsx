import { useState } from 'react';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { categoryColors, categoryIcons } from '../../data/mockTransactions';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const PAGE_SIZE = 8;

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <ArrowUpDown size={13} className="opacity-30" />;
  return sortDir === 'asc' ? <ArrowUp size={13} className="text-accent" /> : <ArrowDown size={13} className="text-accent" />;
}

export default function TransactionTable() {
  const { filteredTransactions, role, deleteTransaction, toggleSort, sortBy, sortDir } = useApp();
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginated = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDelete(id) {
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setDeletingId(null);
    }, 300);
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="font-display font-bold text-ink dark:text-white text-lg">No transactions found</p>
        <p className="text-sm text-ink-muted dark:text-ink-light mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface dark:border-surface-border-dark">
              <th className="text-left pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                <button
                  className="flex items-center gap-1.5 hover:text-ink dark:hover:text-white transition-colors"
                  onClick={() => toggleSort('date')}
                >
                  Date <SortIcon field="date" sortBy={sortBy} sortDir={sortDir} />
                </button>
              </th>
              <th className="text-left pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                Description
              </th>
              <th className="text-left pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="text-left pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                Type
              </th>
              <th className="text-right pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                <button
                  className="flex items-center gap-1.5 ml-auto hover:text-ink dark:hover:text-white transition-colors"
                  onClick={() => toggleSort('amount')}
                >
                  <SortIcon field="amount" sortBy={sortBy} sortDir={sortDir} /> Amount
                </button>
              </th>
              {role === 'admin' && (
                <th className="text-right pb-3 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map(tx => (
              <tr
                key={tx.id}
                className={`
                  border-b border-surface dark:border-surface-border-dark last:border-0
                  hover:bg-surface/60 dark:hover:bg-surface-border-dark/30 transition-all duration-200
                  ${deletingId === tx.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                `}
              >
                <td className="py-3.5 pr-4 text-ink-muted dark:text-ink-light whitespace-nowrap">
                  {formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="font-medium text-ink dark:text-white">{tx.description}</span>
                </td>
                <td className="py-3.5 pr-4">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                      style={{ backgroundColor: (categoryColors[tx.category] || '#94A3B8') + '20' }}
                    >
                      {categoryIcons[tx.category] || '💰'}
                    </span>
                    <span className="text-ink dark:text-white font-medium">{tx.category}</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <Badge type={tx.type} />
                </td>
                <td className={`py-3.5 pr-4 text-right font-bold font-display tabular-nums ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </td>
                {role === 'admin' && (
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center ml-auto text-ink-light hover:bg-expense-light hover:text-expense-dark dark:hover:bg-expense/10 transition-all duration-200"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface dark:border-surface-border-dark">
          <p className="text-xs text-ink-muted dark:text-ink-light">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted dark:text-ink-light hover:bg-surface dark:hover:bg-surface-border-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  p === page
                    ? 'bg-accent text-white shadow-accent'
                    : 'text-ink-muted dark:text-ink-light hover:bg-surface dark:hover:bg-surface-border-dark'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted dark:text-ink-light hover:bg-surface dark:hover:bg-surface-border-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
