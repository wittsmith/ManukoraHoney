import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UserForm from '../components/UserForm';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase.from('usersnew').select('*');
      setUsers(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase.from('usersnew').delete().eq('id', id);
      if (!error) {
        setUsers(users.filter(user => user.id !== id));
      }
    }
  };

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Date' },
    { key: 'actions', label: 'Actions' },
  ];

  const filteredUsers = users
    .filter(u =>
      !search ||
      (u.first_name && u.first_name.toLowerCase().includes(search.toLowerCase())) ||
      (u.last_name && u.last_name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    )
    .map(row => ({
      ...row,
      actions: (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={PencilIcon}
            size="xs"
            onClick={() => navigate(`/manage-users/edit/${row.id}`)}
          />
          <Button
            variant="secondary"
            icon={TrashIcon}
            size="xs"
            color="red"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    }));

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Card className="mb-6">
                <div className="flex items-center justify-between">
                  <Text className="text-2xl font-bold">Manage Users</Text>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add User
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold">View Users</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredUsers}
                />
              </Card>
            </>
          }
        />
        <Route path="new" element={<UserForm mode="add" />} />
        <Route path="edit/:id" element={<UserForm mode="edit" />} />
      </Routes>
    </div>
  );
}

export default ManageUsers; 