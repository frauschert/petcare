'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { createPet } from '@/app/lib/services/pets';
import { petSchema, PetFormData } from '@/app/lib/schemas/pets';
import { useTranslations } from 'next-intl';
import { Input } from '@/app/components/Input';

export default function AddPet() {
  const t = useTranslations('AddPetForm');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormData>({
    mode: 'onChange',
    resolver: zodResolver(petSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await createPet(data);
      if (response?.error) {
        alert(`Error: ${response.error}`);
        return;
      }
      reset();

      toast.success(`Pet ${response.data?.name} added successfully!`);
    } catch (error) {
      toast.error('Failed to add pet');
    }
  });

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-surface-tonal-a20 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('AddPet')}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  {t('Name')}
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>
              <div>
                <label
                  htmlFor="species"
                  className="block text-sm font-medium text-foreground"
                >
                  {t('Species')}
                </label>
                <Input
                  id="species"
                  {...register('species')}
                  error={errors.species?.message}
                />
              </div>
              <div>
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-foreground"
                >
                  {t('Breed')}
                </label>
                <Input
                  id="breed"
                  {...register('breed')}
                  error={errors.breed?.message}
                />
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-foreground"
                >
                  {t('Birthdate')}
                </label>
                <Input
                  id="birthdate"
                  type="date"
                  {...register('birthDate')}
                  className="[&::-webkit-calendar-picker-indicator]:text-amber-50 "
                />
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-foreground"
                >
                  {t('Weight')}
                </label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight')}
                  error={errors.weight?.message}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-foreground bg-primary-a20 hover:bg-primary-a10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  {t('AddPet')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
