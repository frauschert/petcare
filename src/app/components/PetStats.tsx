'use client';

import { AppointmentStats } from './AppointmentStats';
import { MealplanStats } from './MealplanStats';

interface PetStatsProps {
  appointments: {
    id: number;
    type: string;
    date: Date;
    completed: boolean;
  }[];
  mealPlans: {
    id: number;
    foodType: string;
    amount: number;
    unit: string;
    frequency: string;
  }[];
}

export default function PetStats({ appointments, mealPlans }: PetStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppointmentStats appointments={appointments} />
      <MealplanStats mealPlans={mealPlans} />
    </div>
  );
}
