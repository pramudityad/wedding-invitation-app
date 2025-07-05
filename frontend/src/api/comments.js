import api from './axiosConfig';

export const submitComment = async (content) => {
  try {
    const response = await api.post('/comments', { content }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const comment = response.data.comment;
    // Convert CreatedAt string to Date object for consistent handling
    return {
      ...comment,
      CreatedAt: new Date(comment.CreatedAt)
    };
  } catch (error) {
    console.error('Comment submission failed:', error);
    throw error;
  }
};

export const getUserComments = async () => {
  try {
    const response = await api.get('/comments/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user comments:', error);
    throw error;
  }
};

export const getAllComments = async () => {
  try {
    const response = await api.get('/comments');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all comments:', error);
    throw error;
  }
};
