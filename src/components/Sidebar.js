import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArchiveIcon from '@mui/icons-material/Archive';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import GroupIcon from '@mui/icons-material/Group';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import MapIcon from '@mui/icons-material/Map';
import EmailIcon from '@mui/icons-material/Email';
import BarChartIcon from '@mui/icons-material/BarChart';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const SidebarContainer = styled.div`
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  padding: 32px 0 24px 32px;
  letter-spacing: 2px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: 4px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 32px;
  color: #222;
  text-decoration: none;
  font-size: 1rem;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  &.active {
    background: #fffbe6;
    color: #000;
    border-left: 4px solid #FFD86B;
    font-weight: 600;
  }
  &:hover {
    background: #f7f7f7;
  }
`;

const navLinks = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
  { label: 'Manage Products', icon: <InventoryIcon />, to: '/manage-products' },
  { label: 'Manage Codes', icon: <QrCodeIcon />, to: '/manage-codes' },
  { label: 'Archived Codes', icon: <ArchiveIcon />, to: '/archived-codes' },
  { label: 'Manage Batches', icon: <BatchPredictionIcon />, to: '/manage-batches' },
  { label: 'Manage Users', icon: <GroupIcon />, to: '/manage-users' },
  { label: 'Manage Beekeepers', icon: <EmojiNatureIcon />, to: '/manage-beekeepers' },
  { label: 'Manage Regions', icon: <MapIcon />, to: '/manage-regions' },
  { label: 'Manage Emails', icon: <EmailIcon />, to: '/manage-emails' },
  { label: 'Reports', icon: <BarChartIcon />, to: '/reports' },
  { label: 'Manage Content', icon: <ContentPasteIcon />, to: '/manage-content' },
  { label: 'Site Settings', icon: <SettingsIcon />, to: '/site-settings' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <SidebarContainer>
      <Logo>Manukora</Logo>
      <NavList>
        {navLinks.map((link) => (
          <NavItem key={link.label}>
            <StyledNavLink
              to={link.to}
              className={({ isActive }) =>
                isActive || (link.to === '/manage-codes' && location.pathname.startsWith('/manage-codes'))
                  ? 'active'
                  : ''
              }
            >
              {link.icon}
              <span style={{ marginLeft: 16 }}>{link.label}</span>
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
      <StyledNavLink to="/logout" style={{ margin: '16px 0 24px 32px', color: '#888' }}>
        <LogoutIcon style={{ marginRight: 16 }} /> Logout
      </StyledNavLink>
    </SidebarContainer>
  );
}

export default Sidebar;
