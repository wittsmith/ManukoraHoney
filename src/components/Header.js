import React from 'react';
import styled from 'styled-components';
import MenuIcon from '@mui/icons-material/Menu';

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  border-bottom: 1px solid #eee;
  z-index: 10;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const AppName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-left: 16px;
  letter-spacing: 1px;
`;

const UserInfo = styled.div`
  font-size: 1rem;
  color: #444;
`;

function Header() {
  return (
    <HeaderBar>
      <Left>
        <MenuIcon style={{ color: '#FFD86B' }} />
        <AppName>Manage Codes</AppName>
      </Left>
      <UserInfo>Hi, Usernamehere</UserInfo>
    </HeaderBar>
  );
}

export default Header;
