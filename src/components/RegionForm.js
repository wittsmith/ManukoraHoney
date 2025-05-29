import React from 'react';
import ReusableForm from './ReusableForm';

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialState = {
  title: '',
  title_arabic: '',
  description: '',
  description_arabic: '',
  main_image_url: '',
  created_at: getToday(),
};

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title' },
  { name: 'title_arabic', label: 'Title (Arabic)', type: 'text', placeholder: 'Enter Arabic title' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },
  { name: 'description_arabic', label: 'Description (Arabic)', type: 'textarea', placeholder: 'Enter Arabic description' },
  { name: 'main_image_url', label: 'Main Image URL', type: 'text', placeholder: 'Enter main image URL' },
  { name: 'created_at', label: 'Created At', type: 'date', placeholder: 'Select created date' },
];

export default function RegionForm({ mode }) {
  return (
    <ReusableForm
      tableName="regionsnew"
      mode={mode}
      initialState={initialState}
      fields={fields}
      title={mode === 'add' ? 'Add Region' : 'Edit Region'}
      submitLabel={mode === 'add' ? 'Save Region' : 'Update Region'}
      cancelPath="/manage-regions"
    />
  );
} 