export interface Agenda {
  id: number;
  title: string;
  description?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  isAllDay: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}
