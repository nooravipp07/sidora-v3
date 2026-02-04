'use client';

import { FC, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Upload, ArrowLeft, Check } from 'lucide-react';

interface RegisterFormData {
  namaKecamatan: string;
  namaKepala: string;
  nip: string;
  email: string;
  telepon: string;
  alamat: string;
  username: string;
  password: string;
  confirmPassword: string;
  dokumenSK: File | null;
}

const Page: FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    namaKecamatan: '',
    namaKepala: '',
    nip: '',
    email: '',
    telepon: '',
    alamat: '',
    username: '',
    password: '',
    confirmPassword: '',
    dokumenSK: null
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak sama');
      return;
    }

    setIsSubmitted(true);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, dokumenSK: e.target.files[0] });
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBackClick = (): void => {
    router.push('/');
  };

  const handleSuccessClick = (): void => {
    router.push('/');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pendaftaran Berhasil!
          </h1>

          <p className="text-gray-600 mb-6">
            Pendaftaran Anda telah diterima dan akan diverifikasi oleh Admin Kabupaten/Kota dalam 1–2 hari kerja.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Langkah Selanjutnya:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Menunggu verifikasi dokumen SK</li>
              <li>• Aktivasi akun oleh admin</li>
              <li>• Notifikasi email akan dikirim</li>
            </ul>
          </div>

          <button
            onClick={handleSuccessClick}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* =======================
     FORM REGISTRASI
  ======================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-8 px-4">
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Go back home"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Kembali</span>
      </button>
      <div className="max-w-2xl mx-auto pt-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Pendaftaran Kecamatan
                </h1>
                <p className="text-gray-600">
                  Daftar untuk mengakses sistem SIDORA
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kecamatan *
                </label>
                <input
                  type="text"
                  value={formData.namaKecamatan}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('namaKecamatan', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kepala Kecamatan *
                </label>
                <input
                  type="text"
                  value={formData.namaKepala}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('namaKepala', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIP *
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('nip', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('email', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telepon *
                </label>
                <input
                  type="tel"
                  value={formData.telepon}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('telepon', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('username', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                rows={3}
                value={formData.alamat}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('alamat', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('password', e.target.value)
                  }
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumen SK Kecamatan *
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Klik untuk upload atau drag & drop file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Format: PDF, JPG, PNG (Max: 5MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="dokumen-sk"
                  required
                />

                <label
                  htmlFor="dokumen-sk"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer"
                >
                  Pilih File
                </label>

                {formData.dokumenSK && (
                  <p className="text-sm text-green-600 mt-2">
                    File: {formData.dokumenSK.name}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Catatan Penting:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Pastikan semua data yang diisi sudah benar</li>
                <li>• Dokumen SK harus jelas dan dapat dibaca</li>
                <li>• Proses verifikasi memakan waktu 1-2 hari kerja</li>
                <li>• Anda akan mendapat notifikasi via email</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Daftar Sekarang
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
