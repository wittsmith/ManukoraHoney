import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ManageRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegions() {
      setLoading(true);
      const { data, error } = await supabase.from('regionsnew').select('*');
      if (!error) setRegions(data);
      setLoading(false);
    }
    fetchRegions();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Manage Regions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {regions[0] && Object.keys(regions[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map(region => (
              <tr key={region.id}>
                {Object.values(region).map((val, i) => (
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

export default ManageRegions; 