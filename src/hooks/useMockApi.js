import { useState, useEffect, useCallback, useRef } from 'react';
import { mockTransactions } from '../data/mockTransactions';

const BASE_DELAY = 900; // ms — feels like a real network call

/**
 * Simulates a paginated REST endpoint: GET /api/transactions
 * Returns { data, loading, error, refetch, lastFetched }
 *
 * Behaviour:
 *  - First mount: always fetches (ignores localStorage so we see skeletons)
 *  - Subsequent refetch() calls add a shorter delay (250ms) to mimic cache
 *  - 5% random failure rate so the error state is demonstrable
 */
export function useMockApi(overrideData = null) {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const callCount = useRef(0);

  const fetch = useCallback((isRefetch = false) => {
    setLoading(true);
    setError(null);
    callCount.current += 1;

    const delay = isRefetch ? 250 : BASE_DELAY;

    const timer = setTimeout(() => {
      // 5% simulated failure on refetch only (don't fail on initial load)
      if (isRefetch && Math.random() < 0.05) {
        setError('Network error: could not reach /api/transactions');
        setLoading(false);
        return;
      }

      const source = overrideData ?? mockTransactions;
      // Simulate server sorting by date desc
      const sorted = [...source].sort((a, b) => new Date(b.date) - new Date(a.date));
      setData(sorted);
      setLastFetched(new Date());
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [overrideData]);

  useEffect(() => {
    const cleanup = fetch(false);
    return cleanup;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    lastFetched,
    refetch: () => fetch(true),
  };
}

/**
 * Simulates POST /api/transactions
 * Returns { post, posting, postError }
 */
export function useMockPost() {
  const [posting, setPosting]   = useState(false);
  const [postError, setPostError] = useState(null);

  const post = useCallback((payload, onSuccess) => {
    setPosting(true);
    setPostError(null);

    setTimeout(() => {
      if (Math.random() < 0.03) {
        setPostError('Server error: failed to save transaction');
        setPosting(false);
        return;
      }
      const saved = {
        ...payload,
        id: Date.now(),
        amount: payload.type === 'expense'
          ? -Math.abs(Number(payload.amount))
          : Math.abs(Number(payload.amount)),
      };
      setPosting(false);
      onSuccess?.(saved);
    }, 450);
  }, []);

  return { post, posting, postError };
}

/**
 * Simulates DELETE /api/transactions/:id
 */
export function useMockDelete() {
  const [deletingId, setDeletingId] = useState(null);

  const remove = useCallback((id, onSuccess) => {
    setDeletingId(id);
    setTimeout(() => {
      setDeletingId(null);
      onSuccess?.();
    }, 320);
  }, []);

  return { remove, deletingId };
}
