/**
 * Custom hook for infinite scroll comment loading
 * Extracts pagination logic from GuestComments component
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllComments } from '../api/comments';
import { COMMENTS_PER_PAGE } from '../constants';

/**
 * @param {Object} options - Hook options
 * @param {Function} options.t - Translation function from useTranslation
 * @param {string} options.errorKey - i18n key for error message
 * @returns {Object} Comments state and handlers
 */
export function useInfiniteComments({ t, errorKey = 'comments.loadError' }) {
  const [comments, setComments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const lastCommentRef = useRef(null);

  const fetchComments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setError(null);
      setComments([]);
      setNextCursor(null);
    } else {
      setInitialLoading(true);
      setError(null);
    }

    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE });
      setComments(response.comments || []);
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching comments:', err);
      setError(t(errorKey));
    } finally {
      setInitialLoading(false);
    }
  }, [t, errorKey]);

  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const response = await getAllComments({ 
        limit: COMMENTS_PER_PAGE, 
        cursor: nextCursor 
      });
      setComments((prev) => [...prev, ...(response.comments || [])]);
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading more comments:', err);
      setError(t(errorKey));
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore, t, errorKey]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreComments();
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (lastCommentRef.current) {
      observerRef.current.observe(lastCommentRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMoreComments, comments.length]);

  // Initial fetch
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmitted = useCallback((newComment) => {
    setComments((prev) => [newComment, ...prev]);
  }, []);

  const hasMore = !!nextCursor;

  return {
    comments,
    error,
    initialLoading,
    loadingMore,
    hasMore,
    lastCommentRef,
    fetchComments,
    handleCommentSubmitted,
  };
}
