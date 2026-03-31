import { DashboardRepo } from '@/repositories/dashboard.repository';

export const DashboardService = {
  async getKecamatanSummary(filters?: { kecamatanId?: number; year?: number }) {
    return DashboardRepo.getKecamatanSummary(filters);
  },
};
