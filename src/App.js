import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

function App() {
  return (
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;
