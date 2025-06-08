import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'video.js/dist/video-js.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ManageCodes from './pages/ManageCodes';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/ManageProducts';
import ArchivedCodes from './pages/ArchivedCodes';
import ManageBatches from './pages/ManageBatches';
import ManageUsers from './pages/ManageUsers';
import ManageBeekeepers from './pages/ManageBeekeepers';
import ManageRegions from './pages/ManageRegions';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import styled from 'styled-components';
import ManageEmails from './pages/ManageEmails';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background:rgb(141, 141, 141);
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #181A20;
  margin-left: 16rem; /* Tailwind w-64 = 16rem */
`;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppContainer>
                <Sidebar />
                <MainContent>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/manage-codes/*" element={<ManageCodes />} />
                    <Route path="/manage-products/*" element={<ManageProducts />} />
                    <Route path="/archived-codes/*" element={<ArchivedCodes />} />
                    <Route path="/manage-batches/*" element={<ManageBatches />} />
                    <Route path="/manage-users/*" element={<ManageUsers />} />
                    <Route path="/manage-beekeepers/*" element={<ManageBeekeepers />} />
                    <Route path="/manage-regions/*" element={<ManageRegions />} />
                    <Route path="/manage-emails/*" element={<ManageEmails />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </MainContent>
              </AppContainer>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
