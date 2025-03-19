'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AppointmentStatsProps {
  appointments: {
    id: number;
    type: string;
    date: Date;
    completed: boolean;
  }[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const t = useTranslations('AppointmentStats');
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const completed = appointments.filter((apt) => apt.completed).length;
  const total = appointments.length;
  const upcomingCount = appointments.filter(
    (apt) => new Date(apt.date) > today
  ).length;
  const lastMonthCount = appointments.filter(
    (apt) => new Date(apt.date) >= lastMonth && new Date(apt.date) <= today
  ).length;
  const completionRate = total ? ((completed / total) * 100).toFixed(1) : 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-tonal-a10 p-4 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {t('AppointmentStats')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground">{t('CompletionRate')}</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {completionRate}%
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground">{t('Upcoming')}</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {upcomingCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground">{t('Last30Days')}</p>
            <p className="text-2xl font-semibold text-blue-600">
              {lastMonthCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground">{t('TotalAppointments')}</p>
            <p className="text-2xl font-semibold text-gray-600">
              {appointments.length}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
