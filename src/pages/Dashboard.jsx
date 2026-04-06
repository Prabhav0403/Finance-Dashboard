import { useApp } from '../context/useApp';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingPieChart from '../components/dashboard/SpendingPieChart';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import ExportButton from '../components/transactions/ExportButton';
import InsightsSection from '../components/insights/InsightsSection';
import { ChartSkeleton, InsightCardSkeleton, TransactionTableSkeleton } from '../components/ui/Skeleton';

export default function Dashboard() {
  const { loading, transactions, filteredTransactions } = useApp();
  const isInitialLoad = loading && transactions.length === 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

      {/* ── Section 1: Overview ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-ink-muted dark:text-ink-light font-medium uppercase tracking-wider mb-0.5">Overview</p>
            <h1 className="font-display font-black text-2xl text-ink dark:text-white">Financial Dashboard</h1>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-light hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <SummaryCards />
      </section>

      {/* ── Section 2: Charts ── */}
      <section>
        <div className="mb-4">
          <p className="text-xs text-ink-muted dark:text-ink-light font-medium uppercase tracking-wider mb-0.5">Analytics</p>
          <h2 className="font-display font-bold text-xl text-ink dark:text-white">Trends &amp; Breakdown</h2>
        </div>
        {isInitialLoad ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartSkeleton className="col-span-2" height="h-64" />
            <ChartSkeleton height="h-64" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BalanceTrendChart />
            <SpendingPieChart />
          </div>
        )}
      </section>

      {/* ── Section 3: Insights ── */}
      <section>
        {isInitialLoad ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InsightCardSkeleton />
            <InsightCardSkeleton />
            <InsightCardSkeleton />
            <InsightCardSkeleton />
          </div>
        ) : (
          <InsightsSection />
        )}
      </section>

      {/* ── Section 4: Transactions ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-ink-muted dark:text-ink-light font-medium uppercase tracking-wider mb-0.5">History</p>
            <h2 className="font-display font-bold text-xl text-ink dark:text-white">
              Transactions
              {filteredTransactions.length > 0 && (
                <span className="ml-2 text-sm font-normal text-ink-muted dark:text-ink-light">
                  ({filteredTransactions.length})
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton />
            <AddTransactionModal />
          </div>
        </div>

        <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card dark:border dark:border-surface-border-dark p-5">
          <div className="mb-5">
            <TransactionFilters />
          </div>
          {isInitialLoad
            ? <TransactionTableSkeleton rows={6} cols={5} />
            : <TransactionTable />
          }
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-4">
        <p className="text-xs text-ink-light dark:text-ink-muted">
          Finlens · React + Recharts + Mock API · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
