import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import styled from 'styled-components';
import { IconButton, Tooltip, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, Routes, Route } from 'react-router-dom';
import BatchForm from '../components/BatchForm';

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
        <>
          <Tooltip title="Edit">
            <IconButton size="large" color="primary" onClick={() => navigate(`/manage-batches/edit/${b.id}`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="large" color="error" onClick={() => handleDelete(b.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    }));

  return (
    <PageContainer>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TitleBar>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Batches</div>
                <AddButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('new')}
                >
                  Add Batch
                </AddButton>
              </TitleBar>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginRight: 16 }}>View Batches</div>
                <SearchBar
                  size="small"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <ReusableTable columns={columns} rows={filteredBatches} />
            </>
          }
        />
        <Route path="new" element={<BatchForm mode="add" />} />
        <Route path="edit/:id" element={<BatchForm mode="edit" />} />
      </Routes>
    </PageContainer>
  );
}

export default ManageBatches; 