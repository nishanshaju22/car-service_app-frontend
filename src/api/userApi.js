import api from './axios';

export const userApi = {
  updateUser: async (userData) => {
    const response = await api.put('/auth/update', userData);
    return response.data;
  },

  deleteUser: async () => {
    const response = await api.delete('/auth/delete');
    return response.data;
  },
};