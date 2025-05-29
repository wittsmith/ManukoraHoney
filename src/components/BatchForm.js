import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Button, TextField, Switch, FormControlLabel, Typography, MenuItem, Box } from '@mui/material';

const initialState = {
  batch_number: '',
  test_date: '',
  best_before: '',
  mgo_rating: '',
  umf_rating: '',
  glyphosate_certificate_url: '',
  product_certificate_url: '',
  is_arabic: false,
  product_id: '',
  roll_code_start: '',
  roll_code_end: '',
  region_id: '',
};

export default function BatchForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    async function fetchDropdowns() {
      const [{ data: productData }, { data: regionData }] = await Promise.all([
        supabase.from('productsnew').select('id, title, name'),
        supabase.from('regionsnew').select('id, name'),
      ]);
      setProducts(productData || []);
      setRegions(regionData || []);
    }
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      supabase.from('batchesnew').select('*').eq('id', id).single().then(({ data, error }) => {
        if (data) setValues({ ...initialState, ...data });
        setLoading(false);
      });
    }
  }, [mode, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setValues(v => ({
      ...v,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let result;
    const { id: _id, ...rest } = values;
    // Convert empty string UUID fields to null
    const cleaned = { ...rest };
    ['roll_code_start', 'roll_code_end', 'region_id', 'product_id'].forEach(field => {
      if (cleaned[field] === '') cleaned[field] = null;
    });
    if (mode === 'add') {
      result = await supabase.from('batchesnew').insert([cleaned]);
    } else {
      result = await supabase.from('batchesnew').update(cleaned).eq('id', id);
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/manage-batches');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" mb={2}>{mode === 'add' ? 'Add Batch' : 'Edit Batch'}</Typography>
      <TextField fullWidth margin="normal" label="Batch Number" name="batch_number" value={values.batch_number} onChange={handleChange} required />
      <TextField fullWidth margin="normal" label="Test Date" name="test_date" value={values.test_date} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
      <TextField fullWidth margin="normal" label="Best Before" name="best_before" value={values.best_before} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
      <TextField fullWidth margin="normal" label="MGO Rating" name="mgo_rating" value={values.mgo_rating} onChange={handleChange} type="number" />
      <TextField fullWidth margin="normal" label="UMF Rating" name="umf_rating" value={values.umf_rating} onChange={handleChange} type="number" />
      <TextField fullWidth margin="normal" label="Glyphosate Certificate URL" name="glyphosate_certificate_url" value={values.glyphosate_certificate_url} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Product Certificate URL" name="product_certificate_url" value={values.product_certificate_url} onChange={handleChange} />
      <FormControlLabel control={<Switch checked={values.is_arabic} onChange={handleChange} name="is_arabic" />} label="Is Arabic" />
      <TextField select fullWidth margin="normal" label="Product" name="product_id" value={values.product_id} onChange={handleChange} required>
        {products.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.title || p.name}</MenuItem>
        ))}
      </TextField>
      <TextField fullWidth margin="normal" label="Roll Code Start" name="roll_code_start" value={values.roll_code_start} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Roll Code End" name="roll_code_end" value={values.roll_code_end} onChange={handleChange} />
      <TextField select fullWidth margin="normal" label="Region" name="region_id" value={values.region_id} onChange={handleChange}>
        <MenuItem value="">None</MenuItem>
        {regions.map(r => (
          <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
        ))}
      </TextField>
      {error && <Typography color="error" mt={1}>{error}</Typography>}
      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" color="primary" type="submit" disabled={loading}>{mode === 'add' ? 'Save Batch' : 'Update Batch'}</Button>
        <Button variant="outlined" onClick={() => navigate('/manage-batches')} disabled={loading}>Cancel</Button>
      </Box>
    </Box>
  );
} 