import React from 'react';
import { Card, Select, SelectItem, TextInput, Button, Icon } from '@tremor/react';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';

function FilterBar() {
  const [month, setMonth] = React.useState('all');
  const [search, setSearch] = React.useState('');

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-4">
        <Select
          value={month}
          onValueChange={setMonth}
          className="w-40"
        >
          <SelectItem value="all">All Months</SelectItem>
          <SelectItem value="2025-05">May 2025</SelectItem>
          <SelectItem value="2025-04">April 2025</SelectItem>
          {/* Add more months as needed */}
        </Select>

        <div className="flex-1" />

        <TextInput
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-56"
        />

        <Button
          variant="secondary"
          icon={ArrowPathIcon}
          size="xs"
          className="p-2"
        />

        <Button
          variant="primary"
          icon={PlusIcon}
          size="xs"
          className="font-semibold"
        >
          Generate Codes
        </Button>
      </div>
    </Card>
  );
}

export default FilterBar;
