import { useState } from 'react';
import { submitComment, getUserComments, getAllComments } from '../api/comments';

export const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [allComments, setAllComments] = useState([]);

  const postComment = async (content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitComment(content);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to post comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const comments = await getUserComments();
      setUserComments(comments);
      return comments;
    } catch (err) {
      setError(err.message || 'Failed to fetch your comments');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const comments = await getAllComments();
      setAllComments(comments);
      return comments;
    } catch (err) {
      setError(err.message || 'Failed to fetch comments');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    userComments,
    allComments,
    postComment,
    fetchUserComments,
    fetchAllComments
  };
};