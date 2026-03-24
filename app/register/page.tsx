'use client';

import { FC, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft, Eye, EyeOff, Check, Search } from 'lucide-react';

interface RegisterFormData {
	kecamatanId: string;
	nip: string;
	namaLengkap: string;
	email: string;
	telepon: string;
	name: string;
	password: string;
	confirmPassword: string;
	dokumenSK: File | null;
}

interface Kecamatan {
	id: string;
	nama: string;
}

const Page: FC = () => {
	const router = useRouter();

	const [formData, setFormData] = useState<RegisterFormData>({
		kecamatanId: '',
		nip: '',
		email: '',
		telepon: '',
		name: '',
		namaLengkap: '',
		password: '',
		confirmPassword: '',
		dokumenSK: null
	});

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	// 👁️ state password
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// 🔍 state kecamatan
	const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
	const [kecamatanSearch, setKecamatanSearch] = useState('');
	const [filteredKecamatan, setFilteredKecamatan] = useState<Kecamatan[]>([]);
	const [showKecamatanDropdown, setShowKecamatanDropdown] = useState(false);
	const [loadingKecamatan, setLoadingKecamatan] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			alert('Password tidak sama');
		return;
		}

		try {
		setLoading(true);

		const form = new FormData();

		// mapping ke backend
		form.append('name', formData.name);
		form.append('email', formData.email);
		form.append('password', formData.password);
		form.append('nip', formData.nip);
		form.append('namaLengkap', formData.namaLengkap);
		form.append('noTelepon', formData.telepon);
		form.append('kecamatanId', formData.kecamatanId); // sementara

		if (formData.dokumenSK) {
			form.append('dokumenSK', formData.dokumenSK);
		}

		console.log(formData);

		const res = await fetch('/api/registration', {
			method: 'POST',
			body: form
		});

		if (!res.ok) throw new Error();

		setIsSubmitted(true);
		} catch {
			alert('Gagal registrasi');
		} finally {
			setLoading(false);
		}
	};

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
		setFormData({ ...formData, dokumenSK: e.target.files[0] });
		}
	};

	const handleInputChange = (field: keyof RegisterFormData, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSuccessClick = (): void => {
		router.push('/');
	};

	const handleBackClick = () => {
		router.push('/');
	};

	// Fetch kecamatan data
	useEffect(() => {
		const fetchKecamatan = async () => {
			try {
				setLoadingKecamatan(true);
				const res = await fetch('/api/masterdata/kecamatan?limit=100');
				if (!res.ok) throw new Error('Failed to fetch kecamatan');
				const response = await res.json();
				const kecamatanData = response.data || response;
				setKecamatanList(kecamatanData);
				setFilteredKecamatan(kecamatanData);
			} catch (error) {
				console.error('Error fetching kecamatan:', error);
			} finally {
				setLoadingKecamatan(false);
			}
		};

		fetchKecamatan();
	}, []);

	// Live search filtering
	useEffect(() => {
		if (kecamatanSearch.trim() === '') {
			setFilteredKecamatan(kecamatanList);
		} else {
			const filtered = kecamatanList.filter(k =>
				k.nama.toLowerCase().includes(kecamatanSearch.toLowerCase())
			);
			setFilteredKecamatan(filtered);
		}
	}, [kecamatanSearch, kecamatanList]);

	const handleKecamatanSelect = (kecamatan: Kecamatan) => {
		setFormData({ ...formData, kecamatanId: kecamatan.id });
		setKecamatanSearch(kecamatan.nama);
		setShowKecamatanDropdown(false);
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
				Pendaftaran Anda telah diterima dan akan diverifikasi oleh Admin dalam 1–2 hari kerja.
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
					Pendaftaran
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
				<div className="relative">
					<label className="block text-sm font-medium text-gray-700 mb-2">
					Kecamatan *
					</label>
					<div className="relative">
						<div className="flex items-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 bg-white">
							<Search size={18} className="text-gray-400" />
							<input
								type="text"
								placeholder="Cari kecamatan..."
								value={kecamatanSearch}
								onChange={(e) => setKecamatanSearch(e.target.value)}
								onFocus={() => setShowKecamatanDropdown(true)}
								className="flex-1 outline-none bg-transparent"
								required={!formData.kecamatanId}
							/>
						</div>

						{showKecamatanDropdown && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
								{loadingKecamatan ? (
									<div className="p-4 text-center text-gray-500">
										Loading...
									</div>
								) : filteredKecamatan.length > 0 ? (
									filteredKecamatan.map((kecamatan) => (
										<button
											key={kecamatan.id}
											type="button"
											onClick={() => handleKecamatanSelect(kecamatan)}
											className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-200 last:border-b-0 transition-colors"
										>
											<span className="text-gray-900">{kecamatan.nama}</span>
										</button>
									))
								) : (
									<div className="p-4 text-center text-gray-500">
										Tidak ada kecamatan yang cocok
									</div>
								)}
							</div>
						)}
					</div>
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
						value={formData.name}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handleInputChange('name', e.target.value)
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
						required
					/>
				</div>
				</div>
				<div className="grid md:grid-cols-2 gap-6">
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
						<input
							type={showPassword ? 'text' : 'password'}
							value={formData.password}
							onChange={(e) =>
								handleInputChange('password', e.target.value)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(p => !p)}
							className="absolute right-3 top-10"
						>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password *</label>
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							value={formData.confirmPassword}
							onChange={(e) =>
								handleInputChange('confirmPassword', e.target.value)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
							required
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(p => !p)}
							className="absolute right-3 top-10"
						>
						{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
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
