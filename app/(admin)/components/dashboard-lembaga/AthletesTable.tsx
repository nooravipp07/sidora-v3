'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { athletes, getAvailableYears, institutions } from '@/lib/institution/data';
import { InstitutionType } from '@/lib/institution/types';

const ITEMS_PER_PAGE = 10;

export default function AthletesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedInstitutionTypes, setSelectedInstitutionTypes] = useState<InstitutionType[]>(['KONI', 'NPCI', 'KORMI', 'BAPOPSI']);
  const [searchTerm, setSearchTerm] = useState('');

  const availableYears = getAvailableYears();
  const institutionTypes: InstitutionType[] = ['KONI', 'NPCI', 'KORMI', 'BAPOPSI'];

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const yearMatch = athlete.year === selectedYear;
      
      // Find the institution type for this athlete
      const athleteInstitution = institutions.find(inst => inst.id === athlete.institutionId);
      const institutionTypeMatch = athleteInstitution && selectedInstitutionTypes.includes(athleteInstitution.type);
      
      const searchMatch =
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.birthPlace.toLowerCase().includes(searchTerm.toLowerCase());

      return yearMatch && institutionTypeMatch && searchMatch;
    });
  }, [selectedYear, selectedInstitutionTypes, searchTerm]);

  const totalPages = Math.ceil(filteredAthletes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAthletes = useMemo(() => {
    return filteredAthletes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAthletes, startIndex]);

  const handleInstitutionTypeToggle = (type: InstitutionType) => {
    setSelectedInstitutionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Data Atlet</h3>

        {/* Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Cari nama atlet, lembaga, atau tempat lahir..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Year Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <span className="text-sm font-medium text-gray-700 block mb-2">Lembaga:</span>
            <div className="flex flex-wrap gap-2">
              {institutionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleInstitutionTypeToggle(type)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    selectedInstitutionTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tempat Lahir</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal Lahir</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis Kelamin</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lembaga</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cabang Olahraga</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAthletes.map((athlete, idx) => (
              <tr
                key={athlete.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 text-sm text-gray-900">{athlete.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{athlete.birthPlace}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{athlete.dateOfBirth}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{athlete.gender}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{athlete.institution}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{athlete.sport}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 font-medium text-xs"
                    title="Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {paginatedAthletes.map((athlete) => (
          <div key={athlete.id} className="p-4 hover:bg-blue-50 transition-colors">
            <div className="mb-3 flex items-start justify-between">
              <h4 className="font-bold text-gray-900">{athlete.name}</h4>
              <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Tempat Lahir:</span> {athlete.birthPlace}
              </div>
              <div>
                <span className="font-semibold">Lembaga:</span> {athlete.institution}
              </div>
              <div>
                <span className="font-semibold">Cabang Olahraga:</span> {athlete.sport}
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    athlete.status === 'Aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {athlete.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="text-sm text-gray-600">
          Menampilkan {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredAthletes.length)} dari{' '}
          {filteredAthletes.length} atlet
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
