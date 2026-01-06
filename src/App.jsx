import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AddCarPage from './pages/AddCarPage';
import EditCarPage from './pages/EditCarPage';
import ServiceCentersPage from './pages/ServiceCentersPage';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute> 
          } 
        />
        <Route path="/cars/add" element={
            <ProtectedRoute>
              <AddCarPage />
            </ProtectedRoute> 
          }  
        />
        <Route path="/cars/edit/:id" element={
            <ProtectedRoute>
              <EditCarPage />
            </ProtectedRoute> 
          }  
        />
        <Route path="/service-centers" element={
            <ProtectedRoute>
              <ServiceCentersPage />
            </ProtectedRoute> 
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;