import React from 'react';
import ReusableForm from './ReusableForm';
import { updateUser } from '../utils/userSync';

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  can_list_user: false,
  can_add_user: false,
  can_edit_user: false,
  can_delete_user: false,
  can_list_product: false,
  can_add_product: false,
  can_edit_product: false,
  can_delete_product: false,
  can_list_code: false,
  can_generate_code: false,
  can_export_code: false,
  can_import_code: false,
  can_list_beekeeper: false,
  can_add_beekeeper: false,
  can_edit_beekeeper: false,
  can_delete_beekeeper: false,
  can_list_regions: false,
  can_add_regions: false,
  can_edit_regions: false,
  can_delete_regions: false,
  can_list_emails: false,
  can_export_emails: false,
  can_list_batch: false,
  can_create_batch: false,
  can_edit_batch: false,
  can_update_content: false,
  can_update_settings: false,
  can_view_dashboard: false,
  can_view_report: false,
  created_at: getToday(),
};

const fields = [
  { name: 'first_name', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name' },
  { name: 'last_name', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name' },
  { name: 'email', label: 'Email', type: 'text', required: true, placeholder: 'Enter email' },
  { name: 'password', label: 'Password', type: 'text', required: false, placeholder: 'Enter new password (leave blank to keep current)' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter phone number' },
  { name: 'can_list_user', label: 'Can List User', type: 'switch' },
  { name: 'can_add_user', label: 'Can Add User', type: 'switch' },
  { name: 'can_edit_user', label: 'Can Edit User', type: 'switch' },
  { name: 'can_delete_user', label: 'Can Delete User', type: 'switch' },
  { name: 'can_list_product', label: 'Can List Product', type: 'switch' },
  { name: 'can_add_product', label: 'Can Add Product', type: 'switch' },
  { name: 'can_edit_product', label: 'Can Edit Product', type: 'switch' },
  { name: 'can_delete_product', label: 'Can Delete Product', type: 'switch' },
  { name: 'can_list_code', label: 'Can List Code', type: 'switch' },
  { name: 'can_generate_code', label: 'Can Generate Code', type: 'switch' },
  { name: 'can_export_code', label: 'Can Export Code', type: 'switch' },
  { name: 'can_import_code', label: 'Can Import Code', type: 'switch' },
  { name: 'can_list_beekeeper', label: 'Can List Beekeeper', type: 'switch' },
  { name: 'can_add_beekeeper', label: 'Can Add Beekeeper', type: 'switch' },
  { name: 'can_edit_beekeeper', label: 'Can Edit Beekeeper', type: 'switch' },
  { name: 'can_delete_beekeeper', label: 'Can Delete Beekeeper', type: 'switch' },
  { name: 'can_list_regions', label: 'Can List Regions', type: 'switch' },
  { name: 'can_add_regions', label: 'Can Add Regions', type: 'switch' },
  { name: 'can_edit_regions', label: 'Can Edit Regions', type: 'switch' },
  { name: 'can_delete_regions', label: 'Can Delete Regions', type: 'switch' },
  { name: 'can_list_emails', label: 'Can List Emails', type: 'switch' },
  { name: 'can_export_emails', label: 'Can Export Emails', type: 'switch' },
  { name: 'can_list_batch', label: 'Can List Batch', type: 'switch' },
  { name: 'can_create_batch', label: 'Can Create Batch', type: 'switch' },
  { name: 'can_edit_batch', label: 'Can Edit Batch', type: 'switch' },
  { name: 'can_update_content', label: 'Can Update Content', type: 'switch' },
  { name: 'can_update_settings', label: 'Can Update Settings', type: 'switch' },
  { name: 'can_view_dashboard', label: 'Can View Dashboard', type: 'switch' },
  { name: 'can_view_report', label: 'Can View Report', type: 'switch' },
  { name: 'created_at', label: 'Created At', type: 'date', placeholder: 'Select created date' },
];

export default function UserForm({ mode }) {
  const handleSubmit = async (values) => {
    if (mode === 'edit') {
      // For edit mode, use our sync utility
      const { id, ...updateData } = values;
      await updateUser(id, updateData);
    }
    // For add mode, we use the createUser utility in the Signup component
  };

  return (
    <ReusableForm
      tableName="usersnew"
      mode={mode}
      initialState={initialState}
      fields={fields}
      title={mode === 'add' ? 'Add User' : 'Edit User'}
      submitLabel={mode === 'add' ? 'Save User' : 'Update User'}
      cancelPath="/manage-users"
      onSuccess={handleSubmit}
    />
  );
} 