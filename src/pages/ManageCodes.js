import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ManageCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCodes() {
      setLoading(true);
      const { data, error } = await supabase.from('codesnew').select('*');
      if (!error) setCodes(data);
      setLoading(false);
    }
    fetchCodes();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Manage Codes</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {codes[0] && Object.keys(codes[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map(code => (
              <tr key={code.id}>
                {Object.values(code).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageCodes;
