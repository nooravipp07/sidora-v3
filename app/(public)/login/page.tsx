'use client';

import { FC, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
  setUserRole?: (role: string) => void;
}

interface FormData {
  username: string;
  password: string;
}

interface DummyAccount {
  username: string;
  password: string;
  role: string;
}

type UserRole = 'superadmin' | 'admin' | 'admin-kecamatan' | 'verifikator' | 'operator';

const Login: FC<LoginProps> = ({ setIsLoggedIn, setUserRole }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  // Akun dummy
  const dummyAccounts: DummyAccount[] = [
    { username: 'superadmin', password: 'admin123', role: 'superadmin' },
    { username: 'admin_kota', password: 'admin123', role: 'admin' },
    { username: 'admin_utara', password: 'admin123', role: 'admin-kecamatan' },
    { username: 'verifikator1', password: 'admin123', role: 'verifikator' },
    { username: 'operator1', password: 'admin123', role: 'operator' }
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    // const account = dummyAccounts.find(
    //   (acc: DummyAccount) =>
    //     acc.username === formData.username &&
    //     acc.password === formData.password &&
    //     acc.role === selectedRole
    // );

    // if (account) {
    //   setIsLoggedIn?.(true);
    //   setUserRole?.(selectedRole);
    //   router.push('/dashboard');
    // } else {
    //   setError('Username, password, atau role tidak sesuai');
    // }

    router.push('/admin');
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRole(e.target.value as UserRole);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, username: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, password: e.target.value });
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = (): void => {
    router.push('/register');
  };
  const handleHomeClick = () => {
    router.push('/');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 relative">
      <button
        onClick={handleHomeClick}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Go back home"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Kembali</span>
      </button>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* <Trophy className="w-8 h-8 text-white" /> */}
            <img 
                src="/dispora-logo.png" 
                alt="SIDORA Logo" 
                className="w-18 h-18 text-white"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login ke SIDORA
          </h1>
          <p className="text-gray-600">
            Masuk untuk mengakses dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin Kabupaten/Kota</option>
              <option value="admin-kecamatan">Admin Kecamatan</option>
              <option value="verifikator">Verifikator</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={handleUsernameChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <LogIn className="mr-2" />
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={handleRegisterClick}
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
