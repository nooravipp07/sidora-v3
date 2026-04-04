import { DashboardRepo } from '@/repositories/dashboard.repository';

export const DashboardService = {
  async getKecamatanSummary(filters?: { kecamatanId?: number; year?: number }) {
    return DashboardRepo.getKecamatanSummary(filters);
  },

  async getInfrastructureSummary() {
    return DashboardRepo.getInfrastructureSummary();
  },

  async getAchievementTrendsByYear(filters?: { kecamatanId?: number }) {
    return DashboardRepo.getAchievementTrendsByYear(filters);
  },
};
