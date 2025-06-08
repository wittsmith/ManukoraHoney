import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { deleteUser } from '../utils/userSync';

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
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
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
    <div className="flex-1 p-8 bg-[#181A20] min-h-[calc(100vh-64px)]">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="top-section-spacing">
                <div className="flex items-center justify-between h-16 px-8 bg-[#181A20] border-b border-b-[1px] border-[#A3A7B7] z-10 shadow-none rounded-none">
                  <span className="text-2xl font-bold text-white">Manage Users</span>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add User
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold text-white">Search Users</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56 bg-[#23262F] text-[#A3A7B7] placeholder-[#A3A7B7] border border-[#23262F] focus:border-[#FFD86B] focus:ring-0 rounded-lg hover:bg-[#23262F] focus:bg-[#23262F]"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredUsers}
                />
              </div>
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