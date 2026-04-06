import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/useApp';
import { getSpendingByCategory } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { categoryColors } from '../../data/mockTransactions';
import Card from '../ui/Card';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-surface-border-dark rounded-xl shadow-card-hover p-3 text-sm">
      <p className="font-semibold text-ink dark:text-white">{d.name}</p>
      <p className="text-ink-muted dark:text-ink-light mt-0.5">{formatCurrency(d.value)} · {d.percentage}%</p>
    </div>
  );
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) {
  if (percentage < 8) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {percentage}%
    </text>
  );
}

export default function SpendingPieChart() {
  const { transactions } = useApp();
  const data = getSpendingByCategory(transactions).slice(0, 6);

  return (
    <Card padding={false}>
      <div className="px-5 pt-5 pb-2">
        <h3 className="font-display font-bold text-ink dark:text-white">Spending Breakdown</h3>
        <p className="text-xs text-ink-muted dark:text-ink-light mt-0.5">By category</p>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={categoryColors[entry.name] || '#94A3B8'}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="px-5 pb-4 space-y-1.5">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: categoryColors[item.name] || '#94A3B8' }}
              />
              <span className="text-ink-muted dark:text-ink-light font-medium">{item.name}</span>
            </div>
            <span className="font-semibold text-ink dark:text-white">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
