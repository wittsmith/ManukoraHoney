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
  batch_number: '',
  test_date: getToday(),
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

const fields = [
  {
    name: 'batch_number',
    label: 'Batch Number',
    type: 'text',
    required: true,
    placeholder: 'Enter batch number',
  },
  {
    name: 'test_date',
    label: 'Test Date',
    type: 'date',
    placeholder: 'Select test date',
  },
  {
    name: 'best_before',
    label: 'Best Before',
    type: 'date',
    placeholder: 'Select best before date',
  },
  {
    name: 'mgo_rating',
    label: 'MGO Rating',
    type: 'number',
    placeholder: 'Enter MGO rating',
  },
  {
    name: 'umf_rating',
    label: 'UMF Rating',
    type: 'number',
    placeholder: 'Enter UMF rating',
  },
  {
    name: 'glyphosate_certificate_url',
    label: 'Glyphosate Certificate URL',
    type: 'text',
    placeholder: 'Enter glyphosate certificate URL',
  },
  {
    name: 'product_certificate_url',
    label: 'Product Certificate URL',
    type: 'text',
    placeholder: 'Enter product certificate URL',
  },
  {
    name: 'is_arabic',
    label: 'Is Arabic',
    type: 'switch',
  },
  {
    name: 'product_id',
    label: 'Product',
    type: 'select',
    required: true,
    options: {
      source: 'productsnew',
      labelKey: 'title',
      valueKey: 'id',
    },
  },
  {
    name: 'roll_code_start',
    label: 'Roll Code Start',
    type: 'text',
    placeholder: 'Enter roll code start',
  },
  {
    name: 'roll_code_end',
    label: 'Roll Code End',
    type: 'text',
    placeholder: 'Enter roll code end',
  },
  {
    name: 'region_id',
    label: 'Region',
    type: 'select',
    options: {
      source: 'regionsnew',
      labelKey: 'name',
      valueKey: 'id',
    },
  },
];

export default function BatchForm({ mode }) {
  return (
    <ReusableForm
      tableName="batchesnew"
      mode={mode}
      initialState={initialState}
      fields={fields}
      relationships={{
        productsnew: { table: 'productsnew', fields: 'id, title, name' },
        regionsnew: { table: 'regionsnew', fields: 'id, name' },
      }}
      title={mode === 'add' ? 'Add Batch' : 'Edit Batch'}
      submitLabel={mode === 'add' ? 'Save Batch' : 'Update Batch'}
      cancelPath="/manage-batches"
    />
  );
} 