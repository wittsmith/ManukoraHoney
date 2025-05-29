import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import BatchForm from '../components/BatchForm';

function ManageBatches() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [{ data: batchData }, { data: productData }] = await Promise.all([
        supabase.from('batchesnew').select('*'),
        supabase.from('productsnew').select('id, title, name'),
      ]);
      setBatches(batchData || []);
      setProducts(productData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      const { error } = await supabase.from('batchesnew').delete().eq('id', id);
      if (!error) {
        setBatches(batches.filter(batch => batch.id !== id));
      }
    }
  };

  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p.title || p.name || '';
    return acc;
  }, {});

  const columns = [
    { key: 'sno', label: 'S. No' },
    { key: 'batch_number', label: 'Batch Number' },
    { key: 'product_name', label: 'Product Name' },
    { key: 'best_before', label: 'Best Before' },
    { key: 'test_date', label: 'Date' },
    { key: 'actions', label: 'Action' },
  ];

  const filteredBatches = batches
    .filter(b =>
      !search ||
      (b.batch_number && b.batch_number.toLowerCase().includes(search.toLowerCase())) ||
      (productMap[b.product_id] && productMap[b.product_id].toLowerCase().includes(search.toLowerCase()))
    )
    .map((b, idx) => ({
      id: b.id,
      sno: idx + 1,
      batch_number: b.batch_number,
      product_name: productMap[b.product_id] || '',
      best_before: b.best_before || '',
      test_date: b.test_date || '',
      actions: (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={PencilIcon}
            size="xs"
            onClick={() => navigate(`/manage-batches/edit/${b.id}`)}
          />
          <Button
            variant="secondary"
            icon={TrashIcon}
            size="xs"
            color="red"
            onClick={() => handleDelete(b.id)}
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
                  <Text className="text-2xl font-bold">Manage Batches</Text>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add Batch
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold">View Batches</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredBatches}
                />
              </Card>
            </>
          }
        />
        <Route path="new" element={<BatchForm mode="add" />} />
        <Route path="edit/:id" element={<BatchForm mode="edit" />} />
      </Routes>
    </div>
  );
}

export default ManageBatches; 