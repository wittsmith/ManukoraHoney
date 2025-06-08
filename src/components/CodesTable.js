import React from 'react';
import ReusableTable from './ReusableTable';
import { Badge, Button, Tooltip } from '@tremor/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

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

function CodesTable() {
  const columns = [
    { key: 'quantity', label: 'Quantity' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Action' },
    { key: 'notes', label: 'Notes' },
  ];

  const rows = sampleRows.map(row => ({
    ...row,
    actions: (
      <div className="flex gap-2">
        <Tooltip content="Copy">
          <Button size="xs" variant="secondary" icon={ContentCopyIcon} />
                  </Tooltip>
        <Tooltip content="View">
          <Button size="xs" variant="secondary" icon={VisibilityIcon} />
                  </Tooltip>
        <Tooltip content="Delete">
          <Button size="xs" variant="secondary" color="red" icon={DeleteIcon} />
                  </Tooltip>
      </div>
    ),
    status: (
      <Badge 
        color="emerald"
        icon={CheckCircleIcon}
        className="bg-emerald-50 text-emerald-600"
      >
        {row.status}
      </Badge>
    )
  }));

  return <ReusableTable columns={columns} rows={rows} />;
}

export default CodesTable;