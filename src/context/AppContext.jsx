import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { applyFilters, getCategories } from '../utils/calculations';
import { useMockApi, useMockPost, useMockDelete } from '../hooks/useMockApi';

const AppContext = createContext(null);

const ROLE_KEY  = 'finlens_role';
const DARK_KEY  = 'finlens_dark';
const TX_KEY    = 'finlens_transactions';

export function AppProvider({ children }) {
  /* ── Persisted settings ── */
  const [role,     setRole]     = useState(() => localStorage.getItem(ROLE_KEY)  || 'admin');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_KEY)  === 'true');

  /* ── Local transaction store ── */
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem(TX_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  /* ── Mock API ── */
  const { data: apiData, loading, error, refetch, lastFetched } =
    useMockApi(transactions);

  useEffect(() => {
    if (apiData && transactions === null) {
      setTransactions(apiData);
    }
  }, [apiData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (transactions !== null) {
      localStorage.setItem(TX_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  /* ── Mock POST / DELETE ── */
  const { post, posting, postError } = useMockPost();
  const { remove, deletingId }       = useMockDelete();

  /* ── Dark mode ── */
  useEffect(() => {
    localStorage.setItem(DARK_KEY, darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  /* ── Role ── */
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  /* ── Basic filter / sort state ── */
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy,     setSortBy]     = useState('date');
  const [sortDir,    setSortDir]    = useState('desc');
  const [groupBy,    setGroupBy]    = useState('none');

  /* ── Advanced filter state ── */
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [categories,   setCategories]   = useState([]);
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [amountMin,    setAmountMin]    = useState(0);
  const [amountMax,    setAmountMax]    = useState(0);

  /* ── Derived ── */
  const allCategories = useMemo(
    () => getCategories(transactions ?? []),
    [transactions],
  );

  const activeAdvancedCount = useMemo(() => {
    let n = 0;
    if (categories.length)      n++;
    if (dateFrom || dateTo)     n++;
    if (amountMin || amountMax) n++;
    return n;
  }, [categories, dateFrom, dateTo, amountMin, amountMax]);

  const filteredTransactions = useMemo(
    () => applyFilters(transactions ?? [], {
      search, typeFilter, categories, dateFrom, dateTo, amountMin, amountMax, sortBy, sortDir,
    }),
    [transactions, search, typeFilter, categories, dateFrom, dateTo, amountMin, amountMax, sortBy, sortDir],
  );

  /* ── Actions ── */
  function toggleSort(field) {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  }

  function toggleCategory(cat) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  }

  function clearAdvanced() {
    setCategories([]);
    setDateFrom('');
    setDateTo('');
    setAmountMin(0);
    setAmountMax(0);
  }

  const addTransaction = useCallback((form) => {
    post(form, (saved) => {
      setTransactions(prev => [saved, ...(prev ?? [])]);
    });
  }, [post]);

  const deleteTransaction = useCallback((id) => {
    remove(id, () => {
      setTransactions(prev => (prev ?? []).filter(t => t.id !== id));
    });
  }, [remove]);

  const value = {
    transactions: transactions ?? [],
    filteredTransactions,
    allCategories,
    loading,
    error,
    refetch,
    lastFetched,
    posting,
    postError,
    deletingId,
    role, setRole,
    darkMode, setDarkMode,
    search, setSearch,
    typeFilter, setTypeFilter,
    sortBy, sortDir, toggleSort,
    groupBy, setGroupBy,
    advancedOpen, setAdvancedOpen,
    activeAdvancedCount,
    categories, toggleCategory, setCategories,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    amountMin, setAmountMin,
    amountMax, setAmountMax,
    clearAdvanced,
    addTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
