import React from 'react';
import styled from 'styled-components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const sampleRows = [
  {
    quantity: 3100,
    date: '25 May, 2025 - 20:08',
    status: 'Processed',
    notes: 'PO-02530 LLBTCMLG50 units 2800 26.05.25',
  },
  {
    quantity: 2600,
    date: '25 May, 2025 - 19:56',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM600 units 2400 26.05.25',
  },
  {
    quantity: 2600,
    date: '25 May, 2025 - 19:30',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM200 units 2400 26.05.25',
  },
  {
    quantity: 3550,
    date: '25 May, 2025 - 19:09',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM1000NC units 3,200 26.05.25',
  },
  {
    quantity: 4450,
    date: '25 May, 2025 - 18:55',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM850NC units 4,000 26.05.25',
  },
  {
    quantity: 7600,
    date: '25 May, 2025 - 18:36',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM600NC units 6,900 26.05.25',
  },
  {
    quantity: 10100,
    date: '25 May, 2025 - 18:25',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM400NC units 9,100 26.05.25',
  },
  {
    quantity: 9600,
    date: '25 May, 2025 - 17:51',
    status: 'Processed',
    notes: 'PO-02529 LLBTCMSM200NC units 8,700 26.05.25',
  },
];

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`;

function CodesTable() {
  return (
    <TableWrapper>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
              <TableCell><b>Notes</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    icon={<CheckCircleIcon style={{ color: '#1ecb8c' }} />}
                    label={row.status}
                    style={{ background: '#e6fff5', color: '#1ecb8c', fontWeight: 500 }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Copy">
                    <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="View">
                    <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  );
}

export default CodesTable;
