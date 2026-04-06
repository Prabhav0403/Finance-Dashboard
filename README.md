# 💰 Finlens — Finance Dashboard

A clean, responsive, feature-complete Finance Dashboard built with React + Vite + Tailwind CSS + Recharts.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 🧱 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Recharts | 2 | Charts |
| Lucide React | 0.383 | Icons |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                   # Reusable primitives
│   │   ├── Card.jsx          # Base card wrapper
│   │   ├── Button.jsx        # Multi-variant button
│   │   ├── Badge.jsx         # Income/Expense badge
│   │   ├── Modal.jsx         # Accessible modal
│   │   └── Navbar.jsx        # Top navigation
│   ├── dashboard/
│   │   ├── SummaryCards.jsx  # KPI stat cards
│   │   ├── BalanceTrendChart.jsx  # Area chart
│   │   └── SpendingPieChart.jsx   # Pie chart
│   ├── transactions/
│   │   ├── TransactionTable.jsx   # Paginated table
│   │   ├── TransactionFilters.jsx # Search + filters
│   │   └── AddTransactionModal.jsx # Admin form
│   └── insights/
│       └── InsightsSection.jsx    # Smart insights
│
├── pages/
│   └── Dashboard.jsx         # Main page layout
│
├── context/
│   └── AppContext.jsx         # Global state
│
├── data/
│   └── mockTransactions.js   # 30 mock transactions
│
├── utils/
│   ├── calculations.js        # Business logic
│   └── formatters.js          # Display helpers
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## ✨ Features

### Dashboard
- **Summary Cards** — Total Balance, Income, Expenses with trend indicators
- **Area Chart** — Monthly income vs expense trend with custom tooltip
- **Pie Chart** — Spending by category with percentage labels

### Transactions
- **Search** — Real-time filtering by description, category, amount
- **Filter Tabs** — All / Income / Expense
- **Sorting** — By date or amount (ascending/descending)
- **Pagination** — 8 rows per page
- **Empty State** — Friendly message when no results

### Insights
- **Smart Insight** — Auto-generated text based on spending changes
- **Top Spending Category** — Highest all-time category
- **Month Comparison** — Current vs previous month spend
- **Category Progress Bars** — Visual breakdown of all categories

### RBAC (Role-Based UI)
- **Viewer** — Read-only access
- **Admin** — Can add and delete transactions

### Add Transaction (Admin only)
- Description, amount, category, type (income/expense), date
- Client-side validation with inline error messages
- Instant state update

### UX Polish
- ✅ Dark mode toggle (persisted to localStorage)
- ✅ All state persisted to localStorage
- ✅ Staggered entrance animations
- ✅ Hover effects on cards and rows
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Custom scrollbar styling
- ✅ Accessible modal (Escape to close, backdrop click)
- ✅ Smooth delete animation on rows

---

## 🎨 Design System

**Colors**
- Accent: `#F97316` (Orange)
- Income: `#10B981` (Green)
- Expense: `#EF4444` (Red)
- Background: `#F4F5FA`

**Fonts**
- Display / Headings: **Syne** (Google Fonts)
- Body: **Outfit** (Google Fonts)
