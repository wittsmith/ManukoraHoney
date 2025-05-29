import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ManageBeekeepers() {
  const [beekeepers, setBeekeepers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBeekeepers() {
      setLoading(true);
      const { data, error } = await supabase.from('beekeepersnew').select('*');
      if (!error) setBeekeepers(data);
      setLoading(false);
    }
    fetchBeekeepers();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Manage Beekeepers</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {beekeepers[0] && Object.keys(beekeepers[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {beekeepers.map(beekeeper => (
              <tr key={beekeeper.id}>
                {Object.values(beekeeper).map((val, i) => (
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

export default ManageBeekeepers; 