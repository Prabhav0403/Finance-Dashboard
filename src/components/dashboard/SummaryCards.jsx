import { TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { getSummary } from '../../utils/calculations';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { StatCardSkeleton } from '../ui/Skeleton';

function AnimatedCurrency({ value }) {
  const animated = useAnimatedNumber(value, 700);
  // Format animated float as currency
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(Math.abs(animated));
  return <span>{formatted}</span>;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, pill, pillColor, delay }) {
  return (
    <div
      className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card p-5
        transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-default
        dark:border dark:border-surface-border-dark"
      style={{ opacity: 0, animation: `fadeUp 0.4s ease ${delay}ms forwards` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        {pill && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${pillColor}`}>
            {pill}
          </span>
        )}
      </div>
      <p className="text-ink-muted dark:text-ink-light text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="font-display text-2xl font-bold text-ink dark:text-white">
        <AnimatedCurrency value={value} />
      </p>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions, loading, refetch, lastFetched } = useApp();
  const { balance, income, expenses } = getSummary(transactions);

  if (loading && transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Balance"
          value={balance}
          icon={Wallet}
          iconBg="bg-accent-light"
          iconColor="text-accent"
          pill="Live"
          pillColor="bg-income-light text-income-dark"
          delay={50}
        />
        <StatCard
          label="Total Income"
          value={income}
          icon={TrendingUp}
          iconBg="bg-income-light"
          iconColor="text-income"
          pill="↑ 12.5%"
          pillColor="bg-income-light text-income-dark"
          delay={120}
        />
        <StatCard
          label="Total Expenses"
          value={expenses}
          icon={TrendingDown}
          iconBg="bg-expense-light"
          iconColor="text-expense"
          pill="↑ 8.3%"
          pillColor="bg-expense-light text-expense-dark"
          delay={190}
        />
      </div>

      {/* API status bar */}
      <div className="flex items-center gap-2 justify-end">
        {lastFetched && (
          <p className="text-[10px] text-ink-light dark:text-ink-muted">
            Last synced {lastFetched.toLocaleTimeString()}
          </p>
        )}
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-1 text-[10px] font-semibold text-ink-muted dark:text-ink-light hover:text-accent transition-colors disabled:opacity-40"
        >
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing…' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
