import api from './axios';

export const expenseAPI = {
  getByTrip: (tripId) => api.get(`/expenses/trip/${tripId}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.patch(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};
