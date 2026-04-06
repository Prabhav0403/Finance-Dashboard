import { useState, useEffect } from 'react';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { categoryColors, categoryIcons } from '../../data/mockTransactions';
import { groupTransactions } from '../../utils/calculations';
import Badge from '../ui/Badge';

const PAGE_SIZE = 8;

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <ArrowUpDown size={13} className="opacity-30" />;
  return sortDir === 'asc'
    ? <ArrowUp size={13} className="text-accent" />
    : <ArrowDown size={13} className="text-accent" />;
}

function TxRow({ tx, role, onDelete, isDeleting }) {
  return (
    <tr
      className={`
        border-b border-surface dark:border-surface-border-dark last:border-0
        hover:bg-surface/60 dark:hover:bg-surface-border-dark/30
        transition-all duration-300
        ${isDeleting ? 'opacity-0 translate-x-2 scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
    >
      <td className="py-3.5 pr-4 text-ink-muted dark:text-ink-light whitespace-nowrap text-sm">
        {formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="py-3.5 pr-4 max-w-[180px]">
        <span className="font-medium text-ink dark:text-white text-sm truncate block">{tx.description}</span>
      </td>
      <td className="py-3.5 pr-4">
        <span className="flex items-center gap-1.5">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
            style={{ backgroundColor: (categoryColors[tx.category] || '#94A3B8') + '22' }}
          >
            {categoryIcons[tx.category] || '💰'}
          </span>
          <span className="text-sm text-ink dark:text-white font-medium">{tx.category}</span>
        </span>
      </td>
      <td className="py-3.5 pr-4"><Badge type={tx.type} /></td>
      <td className={`py-3.5 pr-4 text-right font-bold font-display tabular-nums text-sm ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
        {tx.type === 'income' ? '+' : '−'}{formatCurrency(Math.abs(tx.amount))}
      </td>
      {role === 'admin' && (
        <td className="py-3.5 text-right">
          <button
            onClick={() => onDelete(tx.id)}
            disabled={isDeleting}
            className="w-7 h-7 rounded-lg flex items-center justify-center ml-auto text-ink-light hover:bg-expense-light hover:text-expense-dark dark:hover:bg-expense/10 transition-all duration-200 disabled:opacity-40"
          >
            <Trash2 size={13} />
          </button>
        </td>
      )}
    </tr>
  );
}

function GroupHeader({ label, count, total }) {
  return (
    <tr>
      <td colSpan={6} className="pt-5 pb-2 px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-px w-4 bg-gray-200 dark:bg-surface-border-dark" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-light">{label}</span>
            <span className="text-[10px] bg-surface dark:bg-surface-border-dark text-ink-muted dark:text-ink-light px-1.5 py-0.5 rounded-md">{count}</span>
          </div>
          <span className={`text-xs font-bold tabular-nums ${total >= 0 ? 'text-income' : 'text-expense'}`}>
            {total >= 0 ? '+' : '−'}{formatCurrency(Math.abs(total))}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default function TransactionTable() {
  const {
    filteredTransactions,
    role,
    deleteTransaction,
    toggleSort, sortBy, sortDir,
    groupBy,
    deletingId,
    error, refetch,
  } = useApp();

  const [page, setPage] = useState(1);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filteredTransactions.length]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const paginated  = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Build grouped view
  const groups = groupBy !== 'none' ? groupTransactions(paginated, groupBy) : null;

  const colCount = role === 'admin' ? 6 : 5;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="text-3xl">⚠️</div>
        <p className="font-semibold text-ink dark:text-white">Failed to load transactions</p>
        <p className="text-sm text-ink-muted">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
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

  const headerClass = "text-left pb-3 pr-4 font-semibold text-ink-muted dark:text-ink-light text-xs uppercase tracking-wider select-none";

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface dark:border-surface-border-dark">
              <th className={headerClass}>
                <button className="flex items-center gap-1.5 hover:text-ink dark:hover:text-white transition-colors" onClick={() => toggleSort('date')}>
                  Date <SortIcon field="date" sortBy={sortBy} sortDir={sortDir} />
                </button>
              </th>
              <th className={headerClass}>Description</th>
              <th className={headerClass}>Category</th>
              <th className={headerClass}>Type</th>
              <th className={`${headerClass} text-right`}>
                <button className="flex items-center gap-1.5 ml-auto hover:text-ink dark:hover:text-white transition-colors" onClick={() => toggleSort('amount')}>
                  <SortIcon field="amount" sortBy={sortBy} sortDir={sortDir} /> Amount
                </button>
              </th>
              {role === 'admin' && <th className={`${headerClass} text-right`}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {groups
              ? groups.map(group => (
                <>
                  <GroupHeader key={`h-${group.key}`} label={group.label} count={group.transactions.length} total={group.total} />
                  {group.transactions.map(tx => (
                    <TxRow
                      key={tx.id}
                      tx={tx}
                      role={role}
                      onDelete={deleteTransaction}
                      isDeleting={deletingId === tx.id}
                    />
                  ))}
                </>
              ))
              : paginated.map(tx => (
                <TxRow
                  key={tx.id}
                  tx={tx}
                  role={role}
                  onDelete={deleteTransaction}
                  isDeleting={deletingId === tx.id}
                />
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination — only shown when not grouping */}
      {!groups && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface dark:border-surface-border-dark">
          <p className="text-xs text-ink-muted dark:text-ink-light">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-1">
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
