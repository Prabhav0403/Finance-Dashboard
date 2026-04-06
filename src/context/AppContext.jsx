import { createContext, useState, useEffect, useMemo } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { applyFilters } from '../utils/calculations';

export const AppContext = createContext(null);

const STORAGE_KEY = 'finlens_transactions';
const ROLE_KEY = 'finlens_role';
const DARK_KEY = 'finlens_dark';

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : mockTransactions;
    } catch {
      return mockTransactions;
    }
  });

  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || 'admin');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_KEY) === 'true');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(DARK_KEY, darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filteredTransactions = useMemo(
    () => applyFilters(transactions, { search, typeFilter, sortBy, sortDir }),
    [transactions, search, typeFilter, sortBy, sortDir]
  );

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    darkMode,
    setDarkMode,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    sortBy,
    sortDir,
    toggleSort: (field) => {
      if (sortBy === field) {
        setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortDir('desc');
      }
    },
    addTransaction: (tx) => {
      const newTx = {
        ...tx,
        id: Date.now(),
        amount:
          tx.type === 'expense'
            ? -Math.abs(Number(tx.amount))
            : Math.abs(Number(tx.amount)),
      };
      setTransactions(prev => [newTx, ...prev]);
    },
    deleteTransaction: (id) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}