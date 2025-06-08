import React from 'react';
import { Card, Text, Button } from '@tremor/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-8 bg-[#181A20] border-b border-b-[1px] border-[#A3A7B7] z-10 shadow-none rounded-none">
      <div className="flex items-center">
        <Bars3Icon className="h-6 w-6 text-[#FFD86B]" />
        <Text className="ml-4 text-xl font-semibold tracking-wide text-white">
          Manukora Admin Panel
        </Text>
      </div>
      <div className="flex items-center gap-4">
        <Text className="text-[#A3A7B7]">
          {user?.email}
        </Text>
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="text-white border border-[#353945] bg-[#23262F] hover:bg-[#353945] hover:text-white"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
