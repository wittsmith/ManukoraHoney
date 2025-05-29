import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const { data, error } = await supabase.from('usersnew').select('*');
      if (!error) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Manage Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {users[0] && Object.keys(users[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                {Object.values(user).map((val, i) => (
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

export default ManageUsers; 