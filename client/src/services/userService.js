import api from './api';

export const getMyMoments = (page, limit) =>
  api.get('/users/me/moments', { params: { page, limit } });

export const getMyProfile = () => api.get('/users/me/profile');
