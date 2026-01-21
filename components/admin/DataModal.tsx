'use client';

import React, { FC, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

interface DataModalProps {
  title: string;
  fields: FormField[];
  data?: any;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSave: (data: any) => void;
}

const DataModal: FC<DataModalProps> = ({
  title,
  fields,
  data,
  mode,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const initialData: Record<string, any> = {};
      fields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    }
  }, [data, fields]);

  const handleInputChange = (name: string, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(formData);
  };

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={isViewMode}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Pilih {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              )}
            </div>
          ))}
        </form>

        {/* Actions - Sticky Footer */}
        <div className="flex space-x-3 p-6 border-t flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {isViewMode ? 'Tutup' : 'Batal'}
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              type="button"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Simpan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataModal;
