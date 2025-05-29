import React from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import styled from 'styled-components';

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`;

const ImageCell = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
`;

function ReusableTable({ columns, rows }) {
  return (
    <TableWrapper>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key}><b>{col.label}</b></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.id || idx}>
                {columns.map(col => {
                  if (col.key === 'image') {
                    return (
                      <TableCell key={col.key}>
                        {row.image ? <ImageCell src={row.image} alt={row.title || ''} /> : null}
                      </TableCell>
                    );
                  }
                  if (col.key === 'status') {
                    return (
                      <TableCell key={col.key}>
                        <span style={{ color: '#FFD86B', fontWeight: 600 }}>{row.status}</span>
                      </TableCell>
                    );
                  }
                  if (col.key === 'actions') {
                    return (
                      <TableCell key={col.key}>
                        {row.actions}
                      </TableCell>
                    );
                  }
                  return <TableCell key={col.key}>{row[col.key]}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  );
}

export default ReusableTable; 