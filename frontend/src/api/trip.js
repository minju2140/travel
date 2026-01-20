import api from './axios';

export const tripAPI = {
  getAll: () => api.get('/trips'),
  create: (data) => api.post('/trips', data),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.patch(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  getStatistics: (id) => api.get(`/trips/${id}/statistics`),
  getSettlement: (id) => api.get(`/trips/${id}/settlement`),
};
