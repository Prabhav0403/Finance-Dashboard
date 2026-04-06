/**
 * Get summary totals from transactions
 */
export function getSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    balance: income - expenses,
    income,
    expenses,
  };
}

/**
 * Get spending by category (expenses only)
 */
export function getSpendingByCategory(transactions) {
  const map = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });

  const total = Object.values(map).reduce((s, v) => s + v, 0);

  return Object.entries(map)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      percentage: total > 0 ? parseFloat(((value / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get balance trend by month (cumulative)
 */
export function getBalanceTrend(transactions) {
  // Group by month
  const monthMap = {};
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(t => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    if (!monthMap[key]) {
      monthMap[key] = { month: label, income: 0, expenses: 0, net: 0 };
    }

    if (t.type === 'income') {
      monthMap[key].income += t.amount;
    } else {
      monthMap[key].expenses += Math.abs(t.amount);
    }
    monthMap[key].net = monthMap[key].income - monthMap[key].expenses;
  });

  // Build cumulative balance
  let running = 0;
  return Object.values(monthMap).map(m => {
    running += m.net;
    return { ...m, balance: parseFloat(running.toFixed(2)) };
  });
}

/**
 * Get transactions for a specific month (YYYY-MM)
 */
export function getTransactionsByMonth(transactions, yearMonth) {
  return transactions.filter(t => t.date.startsWith(yearMonth));
}

/**
 * Get the current and previous month keys
 */
export function getCurrentAndPrevMonth() {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prev = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
  return { current, prev };
}

/**
 * Calculate smart insights
 */
export function getInsights(transactions) {
  const { current, prev } = getCurrentAndPrevMonth();

  const currentTx = getTransactionsByMonth(transactions, current);
  const prevTx = getTransactionsByMonth(transactions, prev);

  const currentSpend = currentTx
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const prevSpend = prevTx
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const spendChange = prevSpend > 0
    ? parseFloat((((currentSpend - prevSpend) / prevSpend) * 100).toFixed(1))
    : 0;

  // Spending by category for current month
  const categorySpend = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] || 0) + Math.abs(t.amount);
    });

  const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];

  // Category-level change
  const currentCatSpend = {};
  currentTx.filter(t => t.type === 'expense').forEach(t => {
    currentCatSpend[t.category] = (currentCatSpend[t.category] || 0) + Math.abs(t.amount);
  });
  const prevCatSpend = {};
  prevTx.filter(t => t.type === 'expense').forEach(t => {
    prevCatSpend[t.category] = (prevCatSpend[t.category] || 0) + Math.abs(t.amount);
  });

  const catChanges = Object.keys(currentCatSpend).map(cat => {
    const curr = currentCatSpend[cat] || 0;
    const prev = prevCatSpend[cat] || 0;
    const change = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
    return { category: cat, change: parseFloat(change.toFixed(1)), current: curr };
  }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return {
    currentSpend,
    prevSpend,
    spendChange,
    topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    biggestCategoryChange: catChanges[0] || null,
    currentMonthLabel: current,
  };
}

/**
 * Apply filters + search + sort to transactions
 */
export function applyFilters(transactions, { search, typeFilter, sortBy, sortDir }) {
  let result = [...transactions];

  // Search
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      t =>
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        String(Math.abs(t.amount)).includes(q)
    );
  }

  // Type filter
  if (typeFilter && typeFilter !== 'all') {
    result = result.filter(t => t.type === typeFilter);
  }

  // Sort
  result.sort((a, b) => {
    let valA, valB;
    if (sortBy === 'date') {
      valA = new Date(a.date);
      valB = new Date(b.date);
    } else if (sortBy === 'amount') {
      valA = Math.abs(a.amount);
      valB = Math.abs(b.amount);
    }
    return sortDir === 'asc' ? valA - valB : valB - valA;
  });

  return result;
}
