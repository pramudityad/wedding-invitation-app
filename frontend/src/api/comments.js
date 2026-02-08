import api from './axiosConfig';

export const submitComment = async (content) => {
  const response = await api.post('/comments', { content }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const comment = response.data.comment;
  return {
    ID: comment.ID,
    Content: comment.Content,
    CreatedAt: new Date(comment.CreatedAt),
    GuestID: comment.GuestID,
    GuestName: comment.GuestName || 'Guest'
  };
};

export const getUserComments = async () => {
  const response = await api.get('/comments/me');
  return response.data;
};

export const getAllComments = async (params = {}) => {
  const response = await api.get('/comments', { params });
  return response.data;
};
