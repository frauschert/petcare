'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPets } from '../lib/services/pets';

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  birthDate: Date | null;
  weight: number | null;
  appointments: any[];
  mealPlans: any[];
}

interface PetListProps {
  pets: Pet[];
}

export function PetList({ pets }: PetListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet, index) => (
        <motion.div
          key={pet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => router.push(`/pet/${pet.id}`)}
          className="bg-clr-surface-a0 p-6 rounded-lg shadow-sm border border-clr-surface-a20 cursor-pointer hover:shadow-md transition-shadow hover:bg-clr-surface-tonal-a10"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {pet.name}
          </h3>
          <p className="text-clr-primary-a20">
            {pet.species} {pet.breed ? `• ${pet.breed}` : ''}
          </p>

          <div className="mt-4 pt-4 border-t border-clr-surface-a20">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-clr-surface-a50">Appointments</p>
                <p className="text-lg font-semibold text-foreground">
                  {pet.appointments.length}
                </p>
              </div>
              <div>
                <p className="text-clr-surface-a50">Meal Plans</p>
                <p className="text-lg font-semibold text-foreground">
                  {pet.mealPlans.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
