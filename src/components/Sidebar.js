import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Card, Text } from '@tremor/react';
import {
  HomeIcon,
  CubeIcon,
  QrCodeIcon,
  ArchiveBoxIcon,
  BeakerIcon,
  UserGroupIcon,
  SparklesIcon,
  MapIcon,
  EnvelopeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { label: 'Dashboard', icon: HomeIcon, to: '/' },
  { label: 'Manage Products', icon: CubeIcon, to: '/manage-products' },
  { label: 'Manage Codes', icon: QrCodeIcon, to: '/manage-codes' },
  { label: 'Archived Codes', icon: ArchiveBoxIcon, to: '/archived-codes' },
  { label: 'Manage Batches', icon: BeakerIcon, to: '/manage-batches' },
  { label: 'Manage Users', icon: UserGroupIcon, to: '/manage-users' },
  { label: 'Manage Beekeepers', icon: SparklesIcon, to: '/manage-beekeepers' },
  { label: 'Manage Regions', icon: MapIcon, to: '/manage-regions' },
  { label: 'Manage Emails', icon: EnvelopeIcon, to: '/manage-emails' },
  { label: 'Reports', icon: ChartBarIcon, to: '/reports' },
  { label: 'Manage Content', icon: DocumentTextIcon, to: '/manage-content' },
  { label: 'Site Settings', icon: Cog6ToothIcon, to: '/site-settings' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed z-40 inset-y-0 left-0 w-64 bg-[#181A20] border-r border-r-[1px] border-[#A3A7B7] flex flex-col">
      <div>
        <div className="flex items-center gap-3 px-6 py-0">
          <img
            src="/manukora-logo.png"
            alt="Manukora Logo"
            className="w-30 h-20 rounded-lg mb-1 object-contain filter invert"
          />
        </div>
        <nav className="mt-2">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `
                    flex items-center px-6 py-2 rounded-lg transition-colors
                    ${isActive || (link.to === '/manage-codes' && location.pathname.startsWith('/manage-codes'))
                      ? 'bg-[#23262F] text-white font-semibold'
                      : 'text-[#A3A7B7] hover:bg-[#23262F] hover:text-white'}
                  `}
                >
                  <link.icon className="h-5 w-5 mr-4" />
                  <Text className="text-base">{link.label}</Text>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-1" />
    </aside>
  );
}

export default Sidebar;
