'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface DataModalProps {
  title: string;
  fields: Field[];
  data: any;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSave: (data: any) => void;
}

const DataModal: React.FC<DataModalProps> = ({ title, fields, data, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const initialData: any = {};
      fields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    }
  }, [data, fields]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (name: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const renderField = (field: Field) => {
    const isReadOnly = mode === 'view';
    const fieldValue = formData[field.name] || '';
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            type={field.type}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            disabled={isReadOnly}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            disabled={isReadOnly}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isReadOnly}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            disabled={isReadOnly}
          />
        );
      
      case 'select':
        return (
          <select
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isReadOnly}
          >
            <option value="">Pilih {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Klik untuk upload atau drag & drop file
            </p>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(field.name, e.target.files[0]);
                }
              }}
              className="hidden"
              id={field.name}
              disabled={isReadOnly}
            />
            <label
              htmlFor={field.name}
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block ${
                isReadOnly ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Pilih File
            </label>
            {formData[field.name] && (
              <p className="text-sm text-green-600 mt-2">
                File: {formData[field.name].name || 'File terpilih'}
              </p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {mode === 'create' ? 'Simpan' : 'Update'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataModal;