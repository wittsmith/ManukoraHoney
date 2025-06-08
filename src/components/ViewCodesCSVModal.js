import React from 'react';
import { Card, Button } from '@tremor/react';

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  return { headers, rows };
}

export default function ViewCodesCSVModal({ open, onClose, csv, code }) {
  if (!open) return null;
  const { headers, rows } = parseCSV(csv || '');

  const handleDownload = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes_${code?.id || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <Card className="max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4">Generated Codes CSV</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="border-b border-gray-200 px-3 py-2 text-left font-semibold bg-gray-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-gray-100 px-3 py-1.5">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="primary" onClick={handleDownload} className="mr-2">Download CSV</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Card>
    </div>
  );
} 