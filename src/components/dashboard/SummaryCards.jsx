import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { getSummary } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

function StatCard({ label, value, icon: Icon, colorClass, bgClass, change, delay }) {
  return (
    <div
      className="stat-card dark:bg-surface-card-dark dark:border dark:border-surface-border-dark"
      style={{ animationDelay: `${delay}ms`, animation: 'fadeUp 0.4s ease forwards', opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}>
          <Icon size={18} className={colorClass} />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${change >= 0 ? 'bg-income-light text-income-dark' : 'bg-expense-light text-expense-dark'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-ink-muted dark:text-ink-light text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display text-2xl font-bold text-ink dark:text-white">{value}</p>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const { balance, income, expenses } = getSummary(transactions);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Balance"
        value={formatCurrency(balance)}
        icon={Wallet}
        bgClass="bg-accent-light"
        colorClass="text-accent"
        delay={50}
      />
      <StatCard
        label="Total Income"
        value={formatCurrency(income)}
        icon={TrendingUp}
        bgClass="bg-income-light"
        colorClass="text-income"
        change={12.5}
        delay={100}
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(expenses)}
        icon={TrendingDown}
        bgClass="bg-expense-light"
        colorClass="text-expense"
        change={8.3}
        delay={150}
      />
    </div>
  );
}
