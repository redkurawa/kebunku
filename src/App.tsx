import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { PlantProvider } from './contexts/PlantProvider';
import { ActivityProvider } from './contexts/ActivityProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

function App() {
  console.log('KebunKU App initialized');
  return (
    <AuthProvider>
      <PlantProvider>
        <ActivityProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ActivityProvider>
      </PlantProvider>
    </AuthProvider>
  );
}

export default App;
