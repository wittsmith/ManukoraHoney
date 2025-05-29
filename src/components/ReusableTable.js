import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
  Tooltip,
} from '@tremor/react';
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

function ReusableTable({ columns, rows }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;

      // Handle different value types
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numbers and other types
      return sortConfig.direction === 'ascending'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
  }, [rows, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'ascending' ? (
      <ChevronUpIcon className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline-block ml-1" />
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableHeaderCell 
                key={col.key} 
                className={`font-semibold ${col.key !== 'actions' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => col.key !== 'actions' && requestSort(col.key)}
              >
                <div className="flex items-center">
                  {col.label}
                  {getSortIcon(col.key)}
                </div>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, idx) => (
            <TableRow key={row.id || idx}>
              {columns.map(col => {
                if (col.key === 'image') {
                  return (
                    <TableCell key={col.key}>
                      {row.image ? (
                        <img 
                          src={row.image} 
                          alt={row.title || ''} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : null}
                    </TableCell>
                  );
                }
                if (col.key === 'status') {
                  return (
                    <TableCell key={col.key}>
                      <Badge 
                        color="emerald"
                        icon={CheckCircleIcon}
                        className="bg-emerald-50 text-emerald-600"
                      >
                        {row.status}
                      </Badge>
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
                return (
                  <TableCell key={col.key}>
                    {row[col.key]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default ReusableTable; 