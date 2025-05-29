import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import BeekeeperForm from '../components/BeekeeperForm';

function ManageBeekeepers() {
  const [beekeepers, setBeekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase.from('beekeepersnew').select('*');
      setBeekeepers(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this beekeeper?')) {
      const { error } = await supabase.from('beekeepersnew').delete().eq('id', id);
      if (!error) {
        setBeekeepers(beekeepers.filter(bk => bk.id !== id));
      }
    }
  };

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'created_at', label: 'Date' },
    { key: 'actions', label: 'Action' },
  ];

  const filteredBeekeepers = beekeepers
    .filter(bk =>
      !search ||
      (bk.title && bk.title.toLowerCase().includes(search.toLowerCase())) ||
      (bk.title_arabic && bk.title_arabic.toLowerCase().includes(search.toLowerCase()))
    )
    .map(row => ({
      ...row,
      image: row.image_url ? (
        <img src={row.image_url} alt={row.title || ''} className="w-12 h-12 object-cover rounded" />
      ) : null,
      actions: (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={PencilIcon}
            size="xs"
            onClick={() => navigate(`/manage-beekeepers/edit/${row.id}`)}
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
                  <Text className="text-2xl font-bold">Manage Beekeepers</Text>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add Beekeeper
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold">View Beekeepers</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredBeekeepers}
                />
              </Card>
            </>
          }
        />
        <Route path="new" element={<BeekeeperForm mode="add" />} />
        <Route path="edit/:id" element={<BeekeeperForm mode="edit" />} />
      </Routes>
    </div>
  );
}

export default ManageBeekeepers; 