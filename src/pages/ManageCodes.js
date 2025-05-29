import React from 'react';
import styled from 'styled-components';
import FilterBar from '../components/FilterBar';
import CodesTable from '../components/CodesTable';

const PageContainer = styled.div`
  flex: 1;
  padding: 32px 40px;
  background: #fafbfc;
  min-height: calc(100vh - 64px);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
`;

function ManageCodes() {
  return (
    <PageContainer>
      <Title>Manage Codes</Title>
      <FilterBar />
      <CodesTable />
    </PageContainer>
  );
}

export default ManageCodes;
