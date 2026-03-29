import { DashboardRepo } from '@/repositories/dashboard.repository';

export const DashboardService = {
  async getKecamatanSummary() {
    return DashboardRepo.getKecamatanSummary();
  },
};
