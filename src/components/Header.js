import React from 'react';
import { Card, Text } from '@tremor/react';
import { Bars3Icon } from '@heroicons/react/24/outline';

function Header() {
  return (
    <Card className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center">
        <Bars3Icon className="h-6 w-6 text-[#FFD86B]" />
        <Text className="ml-4 text-xl font-semibold tracking-wide">
          Manukora Admin Panel
        </Text>
      </div>
      <Text className="text-gray-600">
        Hi, Usernamehere
      </Text>
    </Card>
  );
}

export default Header;
