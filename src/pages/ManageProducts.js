import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase.from('productsnew').select('*');
      setProducts(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('productsnew').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter(product => product.id !== id));
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'mgo_level', label: 'MGO Level' },
    { key: 'size', label: 'Size' },
    { key: 'actions', label: 'Actions' },
  ];

  const filteredProducts = products
    .filter(p =>
      !search ||
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.title && p.title.toLowerCase().includes(search.toLowerCase()))
    )
    .map(row => ({
      ...row,
      actions: (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={PencilIcon}
            size="xs"
            onClick={() => navigate(`/manage-products/edit/${row.id}`)}
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
                <div className="flex items-center justify-between">
                  <Text className="text-2xl font-bold text-white">Manage Products</Text>
                  <Button
                    variant="primary"
                    icon={PlusIcon}
                    onClick={() => navigate('new')}
                    className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  >
                    Add Product
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Text className="font-semibold text-white">Search Products</Text>
                  <TextInput
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-56 bg-[#23262F] text-[#FFFFFF] placeholder-[#A3A7B7] border border-[#23262F] focus:border-[#FFD86B] focus:ring-0 rounded-lg hover:bg-[#23262F] focus:bg-[#23262F]"
                  />
                </div>
                <ReusableTable
                  columns={columns}
                  rows={filteredProducts}
                />
              </div>
            </>
          }
        />
        <Route path="new" element={<ProductForm mode="add" />} />
        <Route path="edit/:id" element={<ProductForm mode="edit" />} />
      </Routes>
    </div>
  );
}

export default ManageProducts; 