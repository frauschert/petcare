'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WhatsNewProps {
  upcomingAppointments: any[];
  recentChanges: {
    type: 'appointment' | 'mealPlan' | 'pet';
    action: 'added' | 'updated' | 'deleted';
    description: string;
    timestamp: Date;
    petId?: number;
  }[];
}

export default function WhatsNew({
  upcomingAppointments,
  recentChanges,
}: WhatsNewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const sortedAppointments = [...upcomingAppointments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const sortedChanges = [...recentChanges]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'added':
        return 'text-emerald-600';
      case 'updated':
        return 'text-blue-600';
      case 'deleted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-a10 text-foreground p-2 rounded-full shadow-lg hover:bg-primary-a30 transition-colors relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {(upcomingAppointments.length > 0 || recentChanges.length > 0) && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full right-0 mt-2 bg-surface-tonal-a40 rounded-lg shadow-xl p-4 w-96"
          >
            <div className="space-y-4">
              {sortedAppointments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-2">
                    {sortedAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => router.push(`/pet/${apt.petId}`)}
                        className="w-full text-left p-2 rounded hover:bg-surface-a50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">
                              {apt.type}
                            </p>
                            <p className="text-sm text-foreground">
                              {apt.pet.name} •{' '}
                              {new Date(apt.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            {new Date(apt.date).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sortedChanges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Recent Changes
                  </h3>
                  <div className="space-y-2">
                    {sortedChanges.map((change, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-2"
                      >
                        <span
                          className={`${getActionColor(change.action)} text-sm`}
                        >
                          {change.action === 'added' && '+'}
                          {change.action === 'deleted' && '−'}
                          {change.action === 'updated' && '⟳'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {change.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {change.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
