import { useState, useCallback, useRef, useEffect } from 'react';
import { getAllComments } from '../api/comments';

export const useInfiniteComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const lastCommentRef = useRef(null);

  const fetchComments = useCallback(async (cursor = null, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);

    try {
      const response = await getAllComments({ limit: 10, cursor });
      const newComments = response.comments || [];
      
      if (isInitial) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }
      
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      const message = isInitial ? 'Failed to load comments' : 'Failed to load more comments';
      setError(message);
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore) return;
    fetchComments(nextCursor, false);
  }, [nextCursor, loadingMore, fetchComments]);

  const addComment = useCallback((newComment) => {
    setComments(prev => [newComment, ...prev]);
  }, []);

  useEffect(() => {
    fetchComments(null, true);
  }, [fetchComments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const currentRef = lastCommentRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore]);

  return {
    comments,
    loading,
    loadingMore,
    error,
    lastCommentRef,
    addComment,
    refetch: () => fetchComments(null, true)
  };
};