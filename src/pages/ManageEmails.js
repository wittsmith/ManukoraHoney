import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Button } from '@tremor/react';

function toCSV(headers, rows) {
  const escape = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
  const headerLine = headers.map(escape).join(',');
  const rowLines = rows.map(row => headers.map(h => escape(row[h])).join(','));
  return [headerLine, ...rowLines].join('\n');
}

export default function ManageEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase.from('emails').select('*');
      setEmails(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!emails.length) {
    return <div>No emails found.</div>;
  }

  const headers = Object.keys(emails[0]);
  const columns = headers.map(key => ({
    key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  const handleDownload = () => {
    const csv = toCSV(headers, emails);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-[#181A20] min-h-[calc(100vh-64px)]">
      <div className="top-section-spacing">
        <div className="flex items-center justify-between h-16 px-8 bg-[#181A20] border-b border-b-[1px] border-[#A3A7B7] z-10 shadow-none rounded-none">
          <h2 className="text-2xl font-semibold text-white">Manage Emails</h2>
          <Button variant="primary" onClick={handleDownload}>Download CSV</Button>
        </div>
      </div>
      <div className="p-6">
        <ReusableTable columns={columns} rows={emails} />
      </div>
    </div>
  );
} 