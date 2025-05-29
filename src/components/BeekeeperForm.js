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
  image_url: '',
  video_url: '',
  created_at: getToday(),
};

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter title' },
  { name: 'title_arabic', label: 'Title (Arabic)', type: 'text', placeholder: 'Enter Arabic title' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },
  { name: 'description_arabic', label: 'Description (Arabic)', type: 'textarea', placeholder: 'Enter Arabic description' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'Enter image URL' },
  { name: 'video_url', label: 'Video URL', type: 'text', placeholder: 'Enter video URL' },
  { name: 'created_at', label: 'Created At', type: 'date', placeholder: 'Select created date' },
];

export default function BeekeeperForm({ mode }) {
  return (
    <ReusableForm
      tableName="beekeepersnew"
      mode={mode}
      initialState={initialState}
      fields={fields}
      title={mode === 'add' ? 'Add Beekeeper' : 'Edit Beekeeper'}
      submitLabel={mode === 'add' ? 'Save Beekeeper' : 'Update Beekeeper'}
      cancelPath="/manage-beekeepers"
    />
  );
} 