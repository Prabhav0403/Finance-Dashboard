import { TrendingUp, TrendingDown, Zap, Award, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { getInsights, getSpendingByCategory } from '../../utils/calculations';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { categoryColors, categoryIcons } from '../../data/mockTransactions';
import Card from '../ui/Card';

function InsightCard({ icon: Icon, iconBg, iconColor, title, value, sub, accent }) {
  return (
    <div className={`
      rounded-2xl p-4 flex items-start gap-3 transition-all duration-300 hover:-translate-y-0.5
      ${accent
        ? 'bg-accent text-white shadow-accent'
        : 'bg-white dark:bg-surface-card-dark shadow-card dark:border dark:border-surface-border-dark'
      }
    `}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-white/20' : iconBg}`}>
        <Icon size={16} className={accent ? 'text-white' : iconColor} />
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${accent ? 'text-white/70' : 'text-ink-muted dark:text-ink-light'}`}>{title}</p>
        <p className={`font-display font-bold text-base leading-tight ${accent ? 'text-white' : 'text-ink dark:text-white'}`}>{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${accent ? 'text-white/80' : 'text-ink-muted dark:text-ink-light'}`}>{sub}</p>}
      </div>
    </div>
  );
}

export default function InsightsSection() {
  const { transactions } = useApp();
  const insights = getInsights(transactions);
  const categoryBreakdown = getSpendingByCategory(transactions);
  const top = categoryBreakdown[0];

  const spendTrend = insights.spendChange;
  const spendIcon = spendTrend > 0 ? TrendingUp : TrendingDown;
  const spendColor = spendTrend > 0 ? 'text-expense' : 'text-income';
  const spendBg = spendTrend > 0 ? 'bg-expense-light' : 'bg-income-light';

  const smartInsight = (() => {
    if (!insights.biggestCategoryChange) return "Your finances look stable this month.";
    const { category, change } = insights.biggestCategoryChange;
    if (Math.abs(change) < 5) return "Spending is consistent with last month.";
    return `${category} spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}% vs last month.`;
  })();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-accent-light flex items-center justify-center">
          <Zap size={13} className="text-accent" />
        </div>
        <h2 className="font-display font-bold text-ink dark:text-white">Smart Insights</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        {/* Smart insight */}
        <InsightCard
          icon={Zap}
          title="AI Insight"
          value={smartInsight}
          accent
        />

        {/* Top category */}
        {top && (
          <InsightCard
            icon={Award}
            iconBg="bg-accent-light"
            iconColor="text-accent"
            title="Top Spending"
            value={top.name}
            sub={`${formatCurrency(top.value)} · ${top.percentage}% of total`}
          />
        )}

        {/* This month spend */}
        <InsightCard
          icon={spendIcon}
          iconBg={spendBg}
          iconColor={spendColor}
          title="This Month"
          value={formatCurrency(insights.currentSpend)}
          sub={
            insights.prevSpend > 0
              ? `${spendTrend > 0 ? '↑' : '↓'} ${Math.abs(spendTrend)}% vs last month`
              : 'No prior month data'
          }
        />

        {/* Savings rate */}
        <InsightCard
          icon={TrendingUp}
          iconBg="bg-income-light"
          iconColor="text-income"
          title="Last Month Spend"
          value={formatCurrency(insights.prevSpend)}
          sub={insights.prevSpend > 0 ? 'Prior month expenses' : 'No data'}
        />
      </div>

      {/* Category bar chart */}
      <div className="mt-4 bg-white dark:bg-surface-card-dark rounded-2xl shadow-card dark:border dark:border-surface-border-dark p-5">
        <h3 className="font-display font-semibold text-ink dark:text-white text-sm mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {categoryBreakdown.slice(0, 6).map(item => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-ink dark:text-white flex items-center gap-1.5">
                  <span>{categoryIcons[item.name] || '💰'}</span>
                  {item.name}
                </span>
                <span className="text-xs font-semibold text-ink-muted dark:text-ink-light">
                  {formatCurrency(item.value)} · {item.percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-surface dark:bg-surface-border-dark rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: categoryColors[item.name] || '#94A3B8',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
