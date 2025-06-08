import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Card, Text, TextInput, Select, SelectItem, Switch, Button } from '@tremor/react';

function ReusableForm({
  tableName,
  mode,
  fields,
  relationships = {},
  validation = {},
  title,
  submitLabel,
  cancelPath,
  initialState = {},
  onSuccess,
  additionalData = {},
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [relatedData, setRelatedData] = useState({});

  // Fetch initial data for edit mode
  useEffect(() => {
    async function fetchInitialData() {
      if (mode === 'edit' && id) {
        setLoading(true);
        try {
          const { data, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

          if (fetchError) throw fetchError;
          if (data) setValues({ ...initialState, ...data });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchInitialData();
  }, [mode, id, tableName, initialState]);

  // Fetch related data
  useEffect(() => {
    async function fetchRelatedData() {
      const data = {};
      for (const [key, config] of Object.entries(relationships)) {
        try {
          const { data: result, error: fetchError } = await supabase
            .from(config.table)
            .select(config.fields);
          
          if (fetchError) throw fetchError;
          data[key] = result;
        } catch (err) {
          console.error(`Error fetching related data for ${key}:`, err);
        }
      }
      setRelatedData(data);
    }
    fetchRelatedData();
  }, [relationships]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { id: _id, ...rest } = values;
      const cleaned = Object.entries(rest).reduce((acc, [key, value]) => {
        const field = fields.find(f => f.name === key);
        let v = field?.transform ? field.transform(value) : value;
        // Convert all empty strings to null before sending to Supabase
        if (v === '') v = null;
        acc[key] = v;
        return acc;
      }, {});

      // Merge additional data with cleaned values
      const finalData = { ...cleaned, ...additionalData };

      let result;
      if (mode === 'add') {
        result = await supabase.from(tableName).insert([finalData]).select();
      } else {
        result = await supabase.from(tableName).update(finalData).eq('id', _id).select();
      }

      if (result.error) throw result.error;

      if (onSuccess) {
        await onSuccess(result.data[0]);
      } else {
        navigate(cancelPath);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render form fields
  const renderField = (field) => {
    const value = values[field.name] ?? '';
    const commonProps = {
      key: field.name,
      required: field.required,
      error: error,
      disabled: loading,
    };

    switch (field.type) {
      case 'custom':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            {field.component}
          </div>
        );
      case 'text':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            <TextInput
              {...commonProps}
              value={value}
              onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              placeholder={field.placeholder}
              className="bg-[#23262F] text-[#F3F4F6] placeholder-[#A3A7B7] hover:bg-[#23262F] focus:bg-[#23262F]"
            />
          </div>
        );
      case 'number':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            <TextInput
              {...commonProps}
              type="number"
              value={value}
              onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              placeholder={field.placeholder}
              className="bg-[#23262F] text-[#F3F4F6] placeholder-[#A3A7B7] hover:bg-[#23262F] focus:bg-[#23262F]"
            />
          </div>
        );
      case 'date':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            <TextInput
              {...commonProps}
              type="date"
              value={value}
              onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              className="bg-[#23262F] text-[#F3F4F6] placeholder-[#A3A7B7] hover:bg-[#23262F] focus:bg-[#23262F]"
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            <Select
              {...commonProps}
              value={value}
              onValueChange={val => setValues(v => ({ ...v, [field.name]: val }))}
              className="bg-[#23262F] text-[#F3F4F6] placeholder-[#A3A7B7] hover:bg-[#23262F] focus:bg-[#23262F]"
            >
              {field.options.static ? (
                field.options.static.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                relatedData[field.options.source]?.map(item => (
                  <SelectItem key={item[field.options.valueKey]} value={item[field.options.valueKey]}>
                    {item[field.options.labelKey]}
                  </SelectItem>
                ))
              )}
            </Select>
          </div>
        );
      case 'switch':
        return (
          <div key={field.name} className="flex flex-col gap-1 pt-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={values[field.name] || false}
                onChange={checked => setValues(v => ({ ...v, [field.name]: checked }))}
                disabled={loading}
              />
              <Text>{field.label}</Text>
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Text className="font-medium mb-1">{field.label}</Text>
            <TextInput
              {...commonProps}
              value={value}
              onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              placeholder={field.placeholder}
              multiline
              rows={4}
              className="bg-[#23262F] text-[#F3F4F6] placeholder-[#A3A7B7] hover:bg-[#23262F] focus:bg-[#23262F]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-[#181A20]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Text className="text-2xl font-bold text-white">{title}</Text>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(cancelPath)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
            >
              {loading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => renderField(field))}
        </div>
      </form>
    </div>
  );
}

export default ReusableForm; 