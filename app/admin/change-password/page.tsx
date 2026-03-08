'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ChangePasswordPage: FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const togglePasswordVisibility = (
    field: keyof typeof showPasswords
  ): void => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal mengubah password');
        return;
      }

      setSuccess(true);
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan pada server');
      console.error('Change password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.oldPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    !loading;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ubah Password</h1>
        <p className="text-sm text-gray-600 mb-8">
          Masukkan password lama dan password baru Anda
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✓ Password berhasil diubah. Anda akan diarahkan ke dashboard...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password Lama
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showPasswords.oldPassword ? 'text' : 'password'}
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange('oldPassword', e.target.value)
                }
                placeholder="Masukkan password lama Anda"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('oldPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                {showPasswords.oldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password Baru
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.newPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange('newPassword', e.target.value)
                }
                placeholder="Masukkan password baru Anda"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                {showPasswords.newPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Minimal 6 karakter
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                placeholder="Konfirmasi password baru Anda"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-all ${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Memproses...' : 'Ubah Password'}
          </button>
        </form>

        {/* Password Requirements */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Persyaratan Password
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ Minimal 6 karakter</li>
            <li>✓ Password lama dan baru harus berbeda</li>
            <li>✓ Konfirmasi password harus cocok dengan password baru</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
