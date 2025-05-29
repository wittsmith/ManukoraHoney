import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import styled from 'styled-components';
import { Button, TextField, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PageContainer = styled.div`
  flex: 1;
  padding: 32px 40px;
  background: #fafbfc;
  min-height: calc(100vh - 64px);
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const AddButton = styled(Button)`
  background: #FFD86B;
  color: #000;
  font-weight: 600;
  &:hover {
    background: #ffe9a7;
  }
`;

const SearchBar = styled(TextField)`
  margin-left: 16px;
`;

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('productsnew').select('*');
      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('productsnew').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter(product => product.id !== id));
      }
    }
  };

  // Map data to table fields
  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ];

  // Filter and map products
  const filteredProducts = products
    .filter(p =>
      !search ||
      (p.title && p.title.toLowerCase().includes(search.toLowerCase()))
    )
    .map(p => ({
      id: p.id,
      image: p.image_url || p.image || '',
      title: p.title || p.name || '',
      date: p.date || '',
      status: p.status || 'Active',
    }));

  return (
    <PageContainer>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TitleBar>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Products</div>
                <AddButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('new')}
                >
                  Add Product
                </AddButton>
              </TitleBar>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginRight: 16 }}>View Products</div>
                <SearchBar
                  size="small"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <ReusableTable
                columns={columns}
                rows={filteredProducts.map(row => ({
                  ...row,
                  actions: (
                    <>
                      <Tooltip title="Edit">
                        <IconButton size="large" color="primary" onClick={() => {
                          console.log('Edit button pressed for id:', row.id);
                          navigate(`/manage-products/edit/${row.id}`);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="large" color="error" onClick={() => handleDelete(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ),
                }))}
              />
            </>
          }
        />
        <Route path="new" element={<ProductForm mode="add" />} />
        <Route path="edit/:id" element={<ProductForm mode="edit" />} />
      </Routes>
    </PageContainer>
  );
}

export default ManageProducts; 