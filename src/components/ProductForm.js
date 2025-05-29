import React from 'react';
import { useParams } from 'react-router-dom';
import ReusableForm from './ReusableForm';

const getDefaultDate = (format) => {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const yy = now.getFullYear().toString().slice(-2);
  if (format === 'DD/MM/YY') return `${dd}/${mm}/${yy}`;
  return `${mm}/${dd}/${yy}`;
};

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialState = {
  name: '',
  mgo_level: '',
  size: '',
  title: '',
  title_arabic: '',
  image_url: '',
  date_format: 'MM/DD/YY',
  date: getToday(),
  email_subscription_enabled: false,
  review_enabled: false,
  purity_enabled: false,
  description: '',
  review_link: '',
};

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter product name',
  },
  {
    name: 'mgo_level',
    label: 'MGO Level',
    type: 'number',
    transform: (value) => value ? parseFloat(value) : null,
    placeholder: 'Enter MGO level',
  },
  {
    name: 'size',
    label: 'Size',
    type: 'text',
    placeholder: 'Enter product size',
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter product title',
  },
  {
    name: 'title_arabic',
    label: 'Title (Arabic)',
    type: 'text',
    placeholder: 'Enter Arabic title',
  },
  {
    name: 'image_url',
    label: 'Image URL',
    type: 'text',
    placeholder: 'Enter image URL',
  },
  {
    name: 'date_format',
    label: 'Date Format',
    type: 'select',
    options: {
      static: [
        { label: 'MM/DD/YY', value: 'MM/DD/YY' },
        { label: 'DD/MM/YY', value: 'DD/MM/YY' },
      ],
    },
  },
  {
    name: 'date',
    label: 'Date',
    type: 'text',
    placeholder: 'Enter date',
  },
  {
    name: 'email_subscription_enabled',
    label: 'Email Subscription Enabled',
    type: 'switch',
  },
  {
    name: 'review_enabled',
    label: 'Review Enabled',
    type: 'switch',
  },
  {
    name: 'purity_enabled',
    label: 'Purity Enabled',
    type: 'switch',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter product description',
  },
  {
    name: 'review_link',
    label: 'Review Link',
    type: 'text',
    placeholder: 'Enter review link',
  },
];

export default function ProductForm({ mode }) {
  return (
    <ReusableForm
      tableName="productsnew"
      mode={mode}
      initialState={initialState}
      fields={fields}
      title={mode === 'add' ? 'Add Product' : 'Edit Product'}
      submitLabel={mode === 'add' ? 'Save Product' : 'Update Product'}
      cancelPath="/manage-products"
    />
  );
} 