'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserForm from '@/components/admin/form/UserForm';
import { Loader } from 'lucide-react';

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data user');
        }
        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengambil data user');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        User tidak ditemukan
      </div>
    );
  }

  return <UserForm initialData={userData} isEdit={true} />;
}
