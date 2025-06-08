import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReusableTable from '../components/ReusableTable';
import { Select, SelectItem, Button, Card } from '@tremor/react';
import GenerateCodesForm from '../components/GenerateCodesForm';
import { EyeIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import ViewCodesCSVPage from '../components/ViewCodesCSVPage';

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month}, ${year} - ${hours}:${minutes}`;
}

function getMonthKey(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

function getMonthLabel(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

function getCSVForCode(code) {
  // For now, get the latestCodesCSV from localStorage
  // In a real app, this should be tied to the code entry
  return localStorage.getItem('latestCodesCSV') || '';
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  return { headers, rows };
}

function ManageCodes() {
  const [codes, setCodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [csvModal, setCSVModal] = useState({ open: false, csv: '', code: null });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [{ data: codesData, error: codesError }, { data: productsData, error: productsError }] = await Promise.all([
        supabase.from('codes').select('*'),
        supabase.from('productsnew').select('id, title, name'),
      ]);
      if (!codesError && !productsError) {
        setCodes(codesData || []);
        setProducts(productsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!codes.length) {
    return <div>No codes found.</div>;
  }

  // Build product id -> name map
  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p.title || p.name || '';
    return acc;
  }, {});

  // Prepare columns: exclude 'id' and 'product_id', add 'product_name', add 'actions'
  const columns = Object.keys(codes[0])
    .filter(key => key !== 'id' && key !== 'product_id')
    .map(key => ({
      key,
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));
  columns.splice(
    codes[0].hasOwnProperty('product_id') ? Object.keys(codes[0]).indexOf('product_id') : columns.length,
    0,
    { key: 'product_name', label: 'Product Name' }
  );
  columns.push({ key: 'actions', label: 'Actions' });

  // Detect date-like fields (ISO 8601 strings)
  const dateKeys = Object.keys(codes[0]).filter(key => {
    const val = codes[0][key];
    return typeof val === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val);
  });

  // Extract all unique months from the first date field
  let monthKeyToLabel = { all: 'All Months' };
  if (dateKeys.length > 0) {
    codes.forEach(code => {
      const val = code[dateKeys[0]];
      const key = getMonthKey(val);
      if (key) monthKeyToLabel[key] = getMonthLabel(val);
    });
  }

  // Add archive handler
  async function handleArchive(code) {
    try {
      // 1. Get CSV for this code batch
      const csv = getCSVForCode(code); // In real app, fetch by code.id/uuid
      if (!csv) {
        alert('No CSV found for this code batch.');
        return;
      }
      const { headers, rows } = parseCSV(csv);
      // 2. Build array for Supabase
      const dataToInsert = rows.map(row => ({
        uuid: row[1],      // UUID
        roll_id: row[2],   // Roll ID
        '#': parseInt(row[0], 10), // ID #
      }));
      // 3. Insert into archived_codes
      const { error } = await supabase.from('archived_codes').insert(dataToInsert);
      if (error) {
        alert('Failed to archive codes: ' + error.message);
      } else {
        alert('Codes archived successfully!');
      }
    } catch (err) {
      alert('Unexpected error: ' + err.message);
    }
  }

  // Prepare rows: exclude 'id', add 'product_name', format dates, add actions
  let rows = codes.map(code => {
    const { id, product_id, ...rest } = code;
    const formatted = { ...rest };
    dateKeys.forEach(key => {
      if (formatted[key]) {
        formatted[key] = formatDate(formatted[key]);
      }
    });
    return {
      ...formatted,
      product_name: productMap[product_id] || product_id || '',
      _monthKey: dateKeys.length > 0 ? getMonthKey(code[dateKeys[0]]) : '',
      actions: (
        <div className="flex gap-2">
        <Button
          icon={EyeIcon}
          variant="secondary"
          size="xs"
          onClick={() => navigate(`view/${code.id}`)}
        />
          <Button
            icon={ArchiveBoxIcon}
            variant="secondary"
            size="xs"
            onClick={() => handleArchive(code)}
          />
        </div>
      ),
    };
  });

  // Filter rows by selected month
  if (selectedMonth !== 'all') {
    rows = rows.filter(row => row._monthKey === selectedMonth);
  }

  // Remove _monthKey from rows before passing to table
  rows = rows.map(({ _monthKey, ...rest }) => rest);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-8 bg-[#181A20] min-h-[calc(100vh-64px)]">
            <div className="top-section-spacing">
              <div className="flex items-center justify-between h-16 px-8 bg-[#181A20] border-b border-b-[1px] border-[#A3A7B7] z-10 shadow-none rounded-none">
                <h2 className="text-2xl font-semibold mb-0 text-white">Manage Codes</h2>
                <Button
                  variant="primary"
                  className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
                  onClick={() => navigate('generate')}
                >
                  Generate Codes
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth} className="w-56">
                  {Object.entries(monthKeyToLabel).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="p-6">
            <ReusableTable columns={columns} rows={rows} />
            </div>
          </div>
        }
      />
      <Route path="generate" element={<GenerateCodesForm products={products} />} />
      <Route path="view/:codeId" element={<ViewCodesCSVPage />} />
    </Routes>
  );
}

export default ManageCodes;
