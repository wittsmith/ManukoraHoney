import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Button, TextField, Switch, FormControlLabel, Typography, MenuItem, Box } from '@mui/material';

const getDefaultDate = (format) => {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const yy = now.getFullYear().toString().slice(-2);
  if (format === 'DD/MM/YY') return `${dd}/${mm}/${yy}`;
  return `${mm}/${dd}/${yy}`;
};

const initialState = {
  name: '',
  mgo_level: '',
  size: '',
  title: '',
  title_arabic: '',
  image_url: '',
  date_format: 'MM/DD/YY',
  date: getDefaultDate('MM/DD/YY'),
  email_subscription_enabled: false,
  review_enabled: false,
  purity_enabled: false,
  description: '',
  review_link: '',
};

export default function ProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      supabase.from('productsnew').select('*').eq('id', id).single().then(({ data, error }) => {
        if (data) setValues({ ...initialState, ...data });
        setLoading(false);
      });
    } else if (mode === 'add') {
      setValues(v => ({ ...v, date: getDefaultDate(v.date_format) }));
    }
  }, [mode, id]);

  useEffect(() => {
    if (mode === 'add') {
      setValues(v => ({ ...v, date: getDefaultDate(v.date_format) }));
    }
  }, [values.date_format, mode]);

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
    if (mode === 'add') {
      result = await supabase.from('productsnew').insert([{ ...rest, mgo_level: rest.mgo_level ? parseFloat(rest.mgo_level) : null }]);
    } else {
      result = await supabase.from('productsnew').update({ ...rest, mgo_level: rest.mgo_level ? parseFloat(rest.mgo_level) : null }).eq('id', id);
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/manage-products');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" mb={2}>{mode === 'add' ? 'Add Product' : 'Edit Product'}</Typography>
      <TextField fullWidth margin="normal" label="Name" name="name" value={values.name} onChange={handleChange} required />
      <TextField fullWidth margin="normal" label="MGO Level" name="mgo_level" value={values.mgo_level} onChange={handleChange} type="number" />
      <TextField fullWidth margin="normal" label="Size" name="size" value={values.size} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Title" name="title" value={values.title} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Title (Arabic)" name="title_arabic" value={values.title_arabic} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Image URL" name="image_url" value={values.image_url} onChange={handleChange} />
      <TextField select fullWidth margin="normal" label="Date Format" name="date_format" value={values.date_format} onChange={handleChange}>
        <MenuItem value="MM/DD/YY">MM/DD/YY</MenuItem>
        <MenuItem value="DD/MM/YY">DD/MM/YY</MenuItem>
      </TextField>
      <TextField fullWidth margin="normal" label="Date" name="date" value={values.date} onChange={handleChange} />
      <FormControlLabel control={<Switch checked={values.email_subscription_enabled} onChange={handleChange} name="email_subscription_enabled" />} label="Email Subscription Enabled" />
      <FormControlLabel control={<Switch checked={values.review_enabled} onChange={handleChange} name="review_enabled" />} label="Review Enabled" />
      <FormControlLabel control={<Switch checked={values.purity_enabled} onChange={handleChange} name="purity_enabled" />} label="Purity Enabled" />
      <TextField fullWidth margin="normal" label="Description" name="description" value={values.description} onChange={handleChange} multiline rows={3} />
      <TextField fullWidth margin="normal" label="Review Link" name="review_link" value={values.review_link} onChange={handleChange} />
      {error && <Typography color="error" mt={1}>{error}</Typography>}
      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" color="primary" type="submit" disabled={loading}>{mode === 'add' ? 'Save Product' : 'Update Product'}</Button>
        <Button variant="outlined" onClick={() => navigate('/manage-products')} disabled={loading}>Cancel</Button>
      </Box>
    </Box>
  );
} 