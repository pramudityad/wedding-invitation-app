import api from './axiosConfig';

export const submitComment = async (content) => {
  try {
    const response = await api.post('/comments', { content }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const comment = response.data.comment;
    // Ensure all required fields are present
    const completeComment = {
      ID: comment.ID,
      Content: comment.Content,
      CreatedAt: new Date(comment.CreatedAt),
      GuestID: comment.GuestID,
      GuestName: comment.GuestName || 'Guest' // Fallback if name is missing
    };
    return completeComment;
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
