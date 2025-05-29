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
    <Card className="w-60 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <Text className="text-3xl font-bold py-6 px-6 tracking-wider">
        Manukora
      </Text>
      
      <nav className="flex-1">
        <ul className="space-y-0.5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `
                  flex items-center px-6 py-2 text-gray-700
                  ${isActive || (link.to === '/manage-codes' && location.pathname.startsWith('/manage-codes'))
                    ? 'bg-yellow-50 border-l-4 border-[#FFD86B] font-semibold'
                    : 'border-l-4 border-transparent'
                  }
                  hover:bg-gray-50 transition-colors
                `}
              >
                <link.icon className="h-5 w-5" />
                <Text className="ml-4">{link.label}</Text>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <NavLink
        to="/logout"
        className="flex items-center px-6 py-2 text-gray-500 hover:bg-gray-50 transition-colors mb-4"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <Text className="ml-4">Logout</Text>
      </NavLink>
    </Card>
  );
}

export default Sidebar;
