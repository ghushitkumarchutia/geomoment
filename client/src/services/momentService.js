import api from './api';

export const submitMoment = (data) => api.post('/moments', data);

export const getHeatmap = (params) => api.get('/moments/heatmap', { params });

export const getMomentsInBounds = (params) => api.get('/moments/bounds', { params });

export const deleteMoment = (id) => api.delete(`/moments/${id}`);

export const updateMoment = (id, data) => api.patch(`/moments/${id}`, data);
