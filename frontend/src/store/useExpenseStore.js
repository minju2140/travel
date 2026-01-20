import { create } from 'zustand';
import { expenseAPI } from '../api/expense';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,
  
  fetchExpenses: async (tripId) => {
    set({ loading: true });
    try {
      const response = await expenseAPI.getByTrip(tripId);
      set({ expenses: response.data.expenses });
    } catch (error) {
      console.error('Fetch expenses error:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  createExpense: async (data) => {
    const response = await expenseAPI.create(data);
    set({ expenses: [response.data.expense, ...get().expenses] });
    return response.data.expense;
  },
  
  updateExpense: async (id, data) => {
    const response = await expenseAPI.update(id, data);
    set({
      expenses: get().expenses.map((exp) =>
        exp.id === id ? response.data.expense : exp
      )
    });
    return response.data.expense;
  },
  
  deleteExpense: async (id) => {
    await expenseAPI.delete(id);
    set({ expenses: get().expenses.filter((exp) => exp.id !== id) });
  },
  
  addExpenseFromSocket: (expense) => {
    set({ expenses: [expense, ...get().expenses] });
  },
  
  updateExpenseFromSocket: (expense) => {
    set({
      expenses: get().expenses.map((exp) =>
        exp.id === expense.id ? expense : exp
      )
    });
  },
  
  deleteExpenseFromSocket: (id) => {
    set({ expenses: get().expenses.filter((exp) => exp.id !== id) });
  },
}));
