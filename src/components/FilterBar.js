import React from 'react';
import styled from 'styled-components';
import { TextField, MenuItem, Button, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const Spacer = styled.div`
  flex: 1;
`;

function FilterBar() {
  const [month, setMonth] = React.useState('all');
  const [search, setSearch] = React.useState('');

  return (
    <Bar>
      <TextField
        select
        label="Select Month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        size="small"
        style={{ minWidth: 160 }}
      >
        <MenuItem value="all">All Months</MenuItem>
        <MenuItem value="2025-05">May 2025</MenuItem>
        <MenuItem value="2025-04">April 2025</MenuItem>
        {/* Add more months as needed */}
      </TextField>
      <Spacer />
      <TextField
        label="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        size="small"
        style={{ minWidth: 220 }}
      />
      <IconButton color="primary" aria-label="refresh">
        <RefreshIcon />
      </IconButton>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{ fontWeight: 600 }}>
        Generate Codes
      </Button>
    </Bar>
  );
}

export default FilterBar;
