'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { createPet } from '@/app/lib/services/pets';
import { petSchema, PetFormData } from '@/app/lib/schemas/pets';

export default function AddPet() {
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Pet
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  {...register('name')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Species
                </label>
                <input
                  {...register('species')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${errors.species ? 'border-red-500' : ''}`}
                />
                {errors.species && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.species.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Breed
                </label>
                <input
                  {...register('breed')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birth Date
                </label>
                <input
                  type="date"
                  {...register('birthDate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
                {errors.weight && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
