import React from 'react';
import { X, Award, MapPin, Zap } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

interface AthleteDetailModalProps {
  athlete: any;
  isOpen: boolean;
  onClose: () => void;
}

const AthleteDetailModal: React.FC<AthleteDetailModalProps> = ({
  athlete,
  isOpen,
  onClose
}) => {
  if (!isOpen || !athlete) return null;

  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const achievements = athlete.achievements || [];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Detail Personel</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photo & Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              {athlete.photoUrl ? (
                <img
                  src={getImageUrl(athlete.photoUrl)}
                  alt={athlete.fullName}
                  className="w-40 h-48 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"%3E%3Crect fill="%23ddd" width="200" height="240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENot Found%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-40 h-48 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Tidak ada foto</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm text-gray-500 font-medium">Nama Lengkap</p>
                <p className="text-lg font-semibold text-gray-900">{athlete.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">NIK</p>
                <p className="text-gray-900">{athlete.nationalId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Jenis Kelamin</p>
                  <p className="text-gray-900">{athlete.gender || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Kategori</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {athlete.category || '-'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Organisasi</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    athlete.organization === 'KONI' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {athlete.organization || '-'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Cabang Olahraga</p>
                  <p className="text-gray-900">{athlete.sport?.nama || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Detailed Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Informasi Lengkap</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Tempat Lahir</p>
                <p className="text-gray-900">{athlete.birthPlace || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tanggal Lahir</p>
                <p className="text-gray-900">{formatDate(athlete.birthDate)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Alamat Lengkap
              </p>
              <p className="text-gray-900 text-sm">{athlete.fullAddress || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Desa/Kelurahan</p>
              <p className="text-gray-900">
                {athlete.desaKelurahan?.kecamatan?.nama} - {athlete.desaKelurahan?.nama}
              </p>
            </div>

            <div className="flex gap-2 text-xs text-gray-500">
              <span>Dibuat: {formatDate(athlete.createdAt)}</span>
              <span>•</span>
              <span>Diperbarui: {formatDate(athlete.updatedAt)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Achievements */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Prestasi ({achievements.length})
            </h3>

            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id || index}
                    className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{achievement.achievementName}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          {achievement.category && (
                            <span className="text-gray-600">
                              <strong>Kategori:</strong> {achievement.category}
                            </span>
                          )}
                          {achievement.medal && (
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <strong>Medali:</strong> {achievement.medal}
                            </span>
                          )}
                          {achievement.year && (
                            <span className="text-gray-600">
                              <strong>Tahun:</strong> {achievement.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500 text-sm">
                Tidak ada prestasi
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthleteDetailModal;
