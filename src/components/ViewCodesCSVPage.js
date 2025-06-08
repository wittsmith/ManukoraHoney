import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from '@tremor/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from '../supabaseClient';

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  return { headers, rows };
}

export default function ViewCodesCSVPage() {
  const navigate = useNavigate();
  const { codeId } = useParams();
  const [code, setCode] = useState(null);
  // For now, get the latestCodesCSV from localStorage
  // In a real app, fetch the CSV for this codeId from backend or DB
  const csv = localStorage.getItem('latestCodesCSV') || '';
  const { headers, rows } = parseCSV(csv);

  useEffect(() => {
    async function fetchCode() {
      const { data } = await supabase.from('codes').select('id, date').eq('id', codeId).single();
      setCode(data);
    }
    fetchCode();
  }, [codeId]);

  const formattedDate = code?.date ? code.date.split('T')[0] : 'unknown';
  const uuid4 = code?.id ? code.id.slice(0, 4) : 'xxxx';
  const filename = `codes_${formattedDate}_${uuid4}.csv`;

  const handleDownload = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-3 p-2 rounded hover:bg-gray-100">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h3 className="text-2xl font-bold mr-4">Generated Codes CSV</h3>
        <Button variant="primary" onClick={handleDownload} className="mr-2">Download CSV</Button>
      </div>
      <Card className="mb-6">
        <div className="overflow-x-auto">
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
      </Card>
      <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
} 