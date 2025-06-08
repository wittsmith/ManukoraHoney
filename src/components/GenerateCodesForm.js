import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableForm from './ReusableForm';

function getTodayISO() {
  const now = new Date();
  return now.toISOString();
}

function generateUUID() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function buildCSV(quantity) {
  let csv = 'ID #,UUID,Roll ID\n';
  for (let i = 1; i <= quantity; i++) {
    csv += `${i},${generateUUID()},\n`;
  }
  return csv;
}

export default function GenerateCodesForm({ products }) {
  const navigate = useNavigate();

  const fields = [
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity',
    },
    {
      name: 'po',
      label: 'PO',
      type: 'text',
      required: false,
      placeholder: 'Enter PO',
    },
    {
      name: 'product_id',
      label: 'Product',
      type: 'select',
      required: false,
      options: {
        static: products.map(p => ({ value: p.id, label: p.title || p.name || p.id })),
      },
    },
    {
      name: 'units',
      label: 'Units',
      type: 'number',
      required: false,
      placeholder: 'Enter units',
    },
    {
      name: 'date2',
      label: 'Date 2',
      type: 'date',
      required: true,
    },
    // Hidden fields for 'date' and 'status'
    {
      name: 'date',
      label: '',
      type: 'hidden',
    },
    {
      name: 'status',
      label: '',
      type: 'hidden',
    },
  ];

  // On submit, add a 'date' field with the current time and 'status' as 'unprocessed'
  const handleSuccess = async (data) => {
    // Generate UUIDs and build CSV
    const quantity = parseInt(data.quantity, 10);
    if (quantity > 0) {
      const csv = buildCSV(quantity);
      localStorage.setItem('latestCodesCSV', csv);
    }
    navigate('/manage-codes');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <ReusableForm
        tableName="codes"
        mode="add"
        fields={fields}
        title="Generate Codes"
        submitLabel="Generate"
        cancelPath="/manage-codes"
        onSuccess={handleSuccess}
        initialState={{ date: getTodayISO(), status: 'unprocessed' }}
      />
    </div>
  );
} 