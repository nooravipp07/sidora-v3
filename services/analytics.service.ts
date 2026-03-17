import { prisma } from '@/lib/prisma';

export interface VisitorStatsResponse {
  totalVisitors: number;
  previousPeriodVisitors: number;
  todayVisitors: number;
  averageDailyVisitors: number;
  lastUpdated: string;
  trend: {
    difference: number;
    percentage: number;
    isPositive: boolean;
  };
  period: {
    current: string;
    previous: string;
  };
}

export class AnalyticsService {
  /**
   * Get visitor statistics from page views
   * Calculates visitors based on unique sessions in the current and previous month
   * @returns Visitor statistics with trend analysis
   */
  static async getVisitorStats(): Promise<VisitorStatsResponse> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Get today's unique visitors (unique sessions)
      const todayVisitorSessions = await prisma.visitor.findMany({
        where: {
          visitedAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      });

      const todayVisitors = todayVisitorSessions.length;

      // Get total unique visitors this month
      const currentMonthVisitors = await prisma.visitor.findMany({
        where: {
          visitedAt: {
            gte: monthStart,
            lt: now
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      });

      const totalVisitors = currentMonthVisitors.length;

      // Get previous month's unique visitors
      const previousMonthVisitors = await prisma.visitor.findMany({
        where: {
          visitedAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      });

      const previousPeriodVisitors = previousMonthVisitors.length;

      // Calculate statistics
      const difference = totalVisitors - previousPeriodVisitors;
      const percentageChange = previousPeriodVisitors > 0
        ? parseFloat(((difference / previousPeriodVisitors) * 100).toFixed(1))
        : 0;

      const daysInMonth = now.getDate();
      const averageDaily = Math.round(totalVisitors / daysInMonth);

      const lastUpdated = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);

      return {
        totalVisitors,
        previousPeriodVisitors,
        todayVisitors,
        averageDailyVisitors: averageDaily,
        trend: {
          difference,
          percentage: percentageChange,
          isPositive: difference >= 0
        },
        lastUpdated,
        period: {
          current: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
          previous: `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`
        }
      };
    } catch (error) {
      console.error('Error fetching visitor statistics:', error);
      
      // Return empty/zero data on error instead of dummy data
      const now = new Date();
      const lastUpdated = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);

      return {
        totalVisitors: 0,
        previousPeriodVisitors: 0,
        todayVisitors: 0,
        averageDailyVisitors: 0,
        trend: {
          difference: 0,
          percentage: 0,
          isPositive: false
        },
        lastUpdated,
        period: {
          current: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
          previous: `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`
        }
      };
    }
  }
}
