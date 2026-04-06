import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../../context/useApp';
import { getBalanceTrend } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-surface-border-dark rounded-xl shadow-card-hover p-3 text-sm">
      <p className="font-semibold text-ink dark:text-white mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-ink-muted dark:text-ink-light capitalize">{p.name}:</span>
          <span className="font-semibold text-ink dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrendChart() {
  const { transactions, darkMode } = useApp();
  const data = getBalanceTrend(transactions);

  const axisColor = darkMode ? '#6B7085' : '#A0A6BE';
  const gridColor = darkMode ? '#2A2D38' : '#F0F1F8';

  return (
    <Card className="col-span-2" padding={false}>
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-ink dark:text-white">Balance Trend</h3>
          <p className="text-xs text-ink-muted dark:text-ink-light mt-0.5">Monthly income vs expenses</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-ink-muted dark:text-ink-light">
            <span className="w-3 h-0.5 bg-income rounded" />Income
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted dark:text-ink-light">
            <span className="w-3 h-0.5 bg-expense rounded" />Expenses
          </span>
        </div>
      </div>
      <div className="h-64 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorIncome)"
              dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#colorExpenses)"
              dot={{ fill: '#EF4444', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
