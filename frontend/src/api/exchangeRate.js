import api from './axios';

export const exchangeRateAPI = {
  getRate: (currency) => api.get(`/exchange-rates/${currency}`),
  getAllRates: () => api.get('/exchange-rates'),
};
