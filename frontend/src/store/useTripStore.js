import { create } from 'zustand';
import { tripAPI } from '../api/trip';

export const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  statistics: null,
  settlement: null,
  loading: false,
  
  fetchTrips: async () => {
    set({ loading: true });
    try {
      const response = await tripAPI.getAll();
      set({ trips: response.data.trips });
    } catch (error) {
      console.error('Fetch trips error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchTrip: async (id) => {
    set({ loading: true });
    try {
      const response = await tripAPI.getById(id);
      set({ currentTrip: response.data.trip });
    } catch (error) {
      console.error('Fetch trip error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  createTrip: async (data) => {
    const response = await tripAPI.create(data);
    set({ trips: [response.data.trip, ...get().trips] });
    return response.data.trip;
  },
  
  deleteTrip: async (id) => {
    await tripAPI.delete(id);
    set({ trips: get().trips.filter((trip) => trip.id !== id) });
  },
  
  fetchStatistics: async (id) => {
    try {
      const response = await tripAPI.getStatistics(id);
      set({ statistics: response.data });
    } catch (error) {
      console.error('Fetch statistics error:', error);
    }
  },
  
  fetchSettlement: async (id) => {
    try {
      const response = await tripAPI.getSettlement(id);
      set({ settlement: response.data.settlement });
    } catch (error) {
      console.error('Fetch settlement error:', error);
    }
  },
}));
