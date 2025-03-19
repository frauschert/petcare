'use client';

import { motion } from 'framer-motion';

interface MealplanStatsProps {
  mealPlans: {
    id: number;
    foodType: string;
    amount: number;
    unit: string;
    frequency: string;
  }[];
}

export function MealplanStats({ mealPlans }: MealplanStatsProps) {
  const foodTypes = new Set(mealPlans.map((plan) => plan.foodType));
  const totalDailyAmount = mealPlans.reduce((acc, plan) => {
    if (plan.frequency.toLowerCase().includes('daily')) {
      return acc + plan.amount;
    }
    return acc;
  }, 0);
  const varietyCount = foodTypes.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface-tonal-a10 p-4 rounded-lg shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground mb-3">
        Meal Plan Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-foreground">Food Variety</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {varietyCount}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground">Daily Amount</p>
          <p className="text-2xl font-semibold text-blue-600">
            {totalDailyAmount.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground">Active Plans</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {mealPlans.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
