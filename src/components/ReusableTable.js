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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#181A20] text-[#A3A7B7] border-collapse">
        <thead>
          <tr className="hover:bg-[#23262F] transition-colors">
            {columns.map(col => (
              <th
                key={col.key} 
                className={`font-semibold border-r border-[#23262F] border-b border-[#3A3C45] last:border-r-0 py-1.5 px-2 text-left text-[#F4F4F5] text-sm ${col.key !== 'actions' ? 'cursor-pointer hover:bg-[#23262F] transition-colors' : ''}`}
                onClick={() => col.key !== 'actions' && requestSort(col.key)}
              >
                <div className="flex items-center">
                  {col.label}
                  {getSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`hover:bg-[#23262F] transition-colors${idx !== sortedRows.length - 1 ? ' border-b border-[#3A3C45]' : ''}`}
            >
              {columns.map(col => {
                if (col.key === 'image') {
                  return (
                    <td key={col.key} className="border-r border-[#23262F] border-b border-[#3A3C45] last:border-r-0 py-2 px-4">
                      {row.image ? (
                        <img 
                          src={row.image} 
                          alt={row.title || ''} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : null}
                    </td>
                  );
                }
                if (col.key === 'status') {
                  return (
                    <td key={col.key} className="border-r border-[#23262F] border-b border-[#3A3C45] last:border-r-0 py-2 px-4">
                      <Badge 
                        color="emerald"
                        icon={CheckCircleIcon}
                        className="bg-emerald-900/20 text-emerald-400 border border-emerald-700"
                      >
                        {row.status}
                      </Badge>
                    </td>
                  );
                }
                if (col.key === 'actions') {
                  return (
                    <td key={col.key} className="border-r border-[#23262F] border-b border-[#3A3C45] last:border-r-0 py-2 px-4">
                      <div className="flex gap-2">
                        {React.Children.map(row.actions?.props?.children || row.actions, (child) =>
                          React.isValidElement(child)
                            ? React.cloneElement(child, { className: (child.props.className || '') + ' h-4 w-4' })
                            : child
                        )}
                      </div>
                    </td>
                  );
                }
                return (
                  <td key={col.key} className="border-r border-[#23262F] border-b border-[#3A3C45] last:border-r-0 py-1.5 px-2 text-sm">
                    {row[col.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReusableTable; 