import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReusableForm from './ReusableForm';
import VideoUploader from './VideoUploader';

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
  { name: 'created_at', label: 'Created At', type: 'date', placeholder: 'Select created date' },
];

export default function BeekeeperForm({ mode }) {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [beekeeperName, setBeekeeperName] = useState('');

  useEffect(() => {
    async function fetchInitialData() {
      if (mode === 'edit' && id) {
        try {
          const { data, error } = await supabase
            .from('beekeepersnew')
            .select('video_url, title')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data?.video_url) {
            setVideoUrl(data.video_url);
          }
          if (data?.title) {
            setBeekeeperName(data.title);
          }
        } catch (err) {
          console.error('Error fetching beekeeper data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [mode, id]);

  const handleVideoUpload = (url) => {
    setVideoUrl(url);
  };

  const handleTitleChange = (title) => {
    setBeekeeperName(title);
  };

  const customFields = [
    ...fields,
    {
      name: 'video_upload',
      label: 'Video Upload',
      type: 'custom',
      component: (
        <VideoUploader
          onUploadComplete={handleVideoUpload}
          initialVideoUrl={videoUrl}
          beekeeperName={beekeeperName}
        />
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ReusableForm
      tableName="beekeepersnew"
      mode={mode}
      initialState={initialState}
      fields={customFields}
      title={mode === 'add' ? 'Add Beekeeper' : 'Edit Beekeeper'}
      submitLabel={mode === 'add' ? 'Save Beekeeper' : 'Update Beekeeper'}
      cancelPath="/manage-beekeepers"
      additionalData={{ video_url: videoUrl }}
      onFieldChange={(fieldName, value) => {
        if (fieldName === 'title') {
          handleTitleChange(value);
        }
      }}
    />
  );
} 