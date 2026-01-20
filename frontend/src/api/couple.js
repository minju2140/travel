import api from './axios';

export const coupleAPI = {
  create: () => api.post('/couple/create'),
  join: (inviteCode) => api.post('/couple/join', { inviteCode }),
  getMe: () => api.get('/couple/me'),
};
