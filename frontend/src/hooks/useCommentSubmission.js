import { useState } from 'react';
import { submitComment } from '../api/comments';

export const useCommentSubmission = (onSuccess) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (content) => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError('Comment cannot be empty');
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await submitComment(trimmed);
      onSuccess?.(response);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.includes('Maximum of 2 comments')
        ? 'You have reached the maximum limit of 2 comments'
        : err.response?.data?.details || err.message || 'Failed to post comment';
      
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error, clearError: () => setError(null) };
};