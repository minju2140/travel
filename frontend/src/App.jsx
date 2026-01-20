import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import Login from './pages/Login';
import Register from './pages/Register';
import CoupleSetup from './pages/CoupleSetup';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const token = useAuthStore((state) => state.token);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token, checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/couple-setup"
          element={
            <PrivateRoute>
              <CoupleSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <TripList />
            </PrivateRoute>
          }
        />
        <Route
          path="/trip/:id"
          element={
            <PrivateRoute>
              <TripDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
