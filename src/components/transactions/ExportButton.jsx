import { useState, useRef } from 'react';
import { Download, FileJson, FileText, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

/**
 * Converts transactions array → CSV string
 */
function toCSV(transactions) {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.id,
    formatDate(t.date),
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    Math.abs(t.amount).toFixed(2),
  ]);
  return [headers, ...rows].map(r => r.join(',')).join('\n');
}

/**
 * Triggers a file download in the browser
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportButton() {
  const { filteredTransactions } = useApp();
  const [open, setOpen]   = useState(false);
  const [flash, setFlash] = useState(null); // 'csv' | 'json'
  const menuRef           = useRef(null);

  const stamp = new Date().toISOString().slice(0, 10); // e.g. 2025-04-05

  function handleExport(format) {
    if (format === 'csv') {
      downloadFile(toCSV(filteredTransactions), `finlens-transactions-${stamp}.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(
        filteredTransactions.map(t => ({ ...t, amount: Math.abs(t.amount) })),
        null,
        2,
      );
      downloadFile(json, `finlens-transactions-${stamp}.json`, 'application/json');
    }
    setFlash(format);
    setTimeout(() => { setFlash(null); setOpen(false); }, 1000);
  }

  // Close on outside click
  function handleBlur(e) {
    if (!menuRef.current?.contains(e.relatedTarget)) setOpen(false);
  }

  const count = filteredTransactions.length;

  return (
    <div className="relative" ref={menuRef} onBlur={handleBlur}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={count === 0}
        className="
          inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
          border border-gray-200 dark:border-surface-border-dark
          text-ink dark:text-white bg-white dark:bg-surface-card-dark
          hover:border-accent hover:text-accent dark:hover:border-accent dark:hover:text-accent
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200 shadow-card
        "
      >
        <Download size={14} />
        Export
        <span className="text-xs font-normal text-ink-muted dark:text-ink-light">({count})</span>
        <ChevronDown
          size={12}
          className={`ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute right-0 mt-2 w-44 z-30
          bg-white dark:bg-surface-card-dark
          border border-gray-100 dark:border-surface-border-dark
          rounded-xl shadow-card-hover
          animate-scale-in overflow-hidden
        ">
          <div className="px-3 py-2 border-b border-gray-50 dark:border-surface-border-dark">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-light">
              Export {count} row{count !== 1 ? 's' : ''}
            </p>
          </div>

          {[
            { format: 'csv',  Icon: FileText, label: 'CSV File',  sub: 'Open in Excel / Sheets' },
            { format: 'json', Icon: FileJson, label: 'JSON File', sub: 'For developers / APIs' },
          ].map(({ format, Icon, label, sub }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface dark:hover:bg-surface-border-dark transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                {flash === format
                  ? <Check size={13} className="text-income" />
                  : <Icon size={13} className="text-accent" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-white leading-none">{label}</p>
                <p className="text-[10px] text-ink-muted dark:text-ink-light mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
