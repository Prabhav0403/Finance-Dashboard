export default function Badge({ type }) {
  if (type === 'income') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-income-light text-income-dark">
        <span className="w-1.5 h-1.5 rounded-full bg-income inline-block" />
        Income
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-expense-light text-expense-dark">
      <span className="w-1.5 h-1.5 rounded-full bg-expense inline-block" />
      Expense
    </span>
  );
}
