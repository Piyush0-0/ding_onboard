import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LandingPage from './pages/LandingPage';
import OnboardingFlow from './pages/OnboardingFlow';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Route Protection Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#dc2626',
    colorLink: '#dc2626',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public routes - accessible to everyone */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Public routes - redirect to dashboard if logged in */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              
              {/* Onboarding route - single route, backend determines step */}
              <Route path="/onboarding" element={<OnboardingFlow />} />
              
              {/* Protected routes - require authentication */}
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
