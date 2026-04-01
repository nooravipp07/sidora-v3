import { HeroSectionConfigRepository } from '@/repositories/hero-section.repository';
import { PaginationParams } from '@/repositories/abstract.repository';

export const HeroSectionService = {
  /**
   * Get all hero section configs with pagination
   */
  async getAll(filter: { status?: number }, pagination: PaginationParams) {
    return HeroSectionConfigRepository.findAll(filter, pagination);
  },

  /**
   * Get hero section config by ID
   */
  async getById(id: number) {
    const config = await HeroSectionConfigRepository.findById(id);

    if (!config) {
      throw new Error('Hero section config tidak ditemukan');
    }

    return config;
  },

  /**
   * Get all active hero sections for display
   */
  async getActive() {
    const configs = await HeroSectionConfigRepository.findActive();

    if (configs.length === 0) {
      throw new Error('Tidak ada hero section yang aktif');
    }

    return configs;
  },

  /**
   * Create new hero section config
   */
  async create(data: {
    title: string;
    description: string;
    bannerImageUrl: string;
    displayOrder?: number;
    status?: number;
  }) {
    // Validation
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title tidak boleh kosong');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Description tidak boleh kosong');
    }

    if (!data.bannerImageUrl) {
      throw new Error('Banner image URL tidak boleh kosong');
    }

    return HeroSectionConfigRepository.create(data);
  },

  /**
   * Update hero section config
   */
  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      bannerImageUrl?: string;
      displayOrder?: number;
      status?: number;
    }
  ) {
    // Validate ID exists
    const existing = await HeroSectionConfigRepository.findById(id);
    if (!existing) {
      throw new Error('Hero section config tidak ditemukan');
    }

    // Validation
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error('Title tidak boleh kosong');
    }

    if (data.description !== undefined && data.description.trim().length === 0) {
      throw new Error('Description tidak boleh kosong');
    }

    return HeroSectionConfigRepository.update(id, data);
  },

  /**
   * Delete hero section config
   */
  async delete(id: number) {
    const config = await HeroSectionConfigRepository.findById(id);

    if (!config) {
      throw new Error('Hero section config tidak ditemukan');
    }

    return HeroSectionConfigRepository.delete(id);
  },

  /**
   * Update status (aktif/non-aktif)
   */
  async updateStatus(id: number, status: number) {
    if (status !== 0 && status !== 1) {
      throw new Error('Status harus 0 atau 1');
    }

    const config = await HeroSectionConfigRepository.findById(id);

    if (!config) {
      throw new Error('Hero section config tidak ditemukan');
    }

    return HeroSectionConfigRepository.updateStatus(id, status);
  },

  /**
   * Reorder hero sections
   */
  async reorder(items: Array<{ id: number; displayOrder: number }>) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items tidak valid');
    }

    return HeroSectionConfigRepository.reorder(items);
  },
};
