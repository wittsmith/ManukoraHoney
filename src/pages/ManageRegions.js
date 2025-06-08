import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import RegionForm from '../components/RegionForm';

function ManageRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase.from('regionsnew').select('*');
      setRegions(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this region?')) {
      const { error } = await supabase.from('regionsnew').delete().eq('id', id);
      if (!error) {
        setRegions(regions.filter(region => region.id !== id));
      }
    }
  };

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'created_at', label: 'Date' },
    { key: 'actions', label: 'Action' },
  ];

  const filteredRegions = regions
    .filter(region =>
      !search ||
      (region.title && region.title.toLowerCase().includes(search.toLowerCase())) ||
      (region.title_arabic && region.title_arabic.toLowerCase().includes(search.toLowerCase()))
    )
    .map(row => ({
      ...row,
      image: row.main_image_url ? (
        <img src={row.main_image_url} alt={row.title || ''} className="w-12 h-12 object-cover rounded" />
      ) : null,
      actions: (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={PencilIcon}
            size="xs"
            onClick={() => navigate(`/manage-regions/edit/${row.id}`)}
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
                  <span className="text-2xl font-bold text-white">Manage Regions</span>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add Region
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold text-white">Search Regions</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56 bg-[#23262F] text-[#FFFFFF] placeholder-[#A3A7B7] border border-[#23262F] focus:border-[#FFD86B] focus:ring-0 rounded-lg hover:bg-[#23262F] focus:bg-[#23262F]"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredRegions}
                />
              </div>
            </>
          }
        />
        <Route path="new" element={<RegionForm mode="add" />} />
        <Route path="edit/:id" element={<RegionForm mode="edit" />} />
      </Routes>
    </div>
  );
}

export default ManageRegions; 