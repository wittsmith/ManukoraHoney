import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';

function ArchivedCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCodes() {
      setLoading(true);
      const { data, error } = await supabase.from('archived_codes').select('*');
      if (!error) setCodes(data);
      setLoading(false);
    }
    fetchCodes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!codes.length) {
    return <div>No archived codes found.</div>;
  }

  const columns = Object.keys(codes[0]).map(key => ({
    key,
    label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  return (
    <div className="p-8 bg-[#181A20] min-h-[calc(100vh-64px)]">
      <div className="top-section-spacing">
        <div className="flex items-center justify-between h-16 px-8 bg-[#181A20] border-b border-b-[1px] border-[#A3A7B7] z-10 shadow-none rounded-none">
          <h2 className="text-2xl font-semibold mb-0 text-white">Archived Codes</h2>
          <div />
        </div>
      </div>
      <div className="p-6">
        <ReusableTable columns={columns} rows={codes} />
      </div>
    </div>
  );
}

export default ArchivedCodes; 