'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import KeyboardShortcuts from '@/app/components/KeyboardShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsNew from '../../../components/WhatsNew';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const appointmentSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
});

const mealPlanSchema = z.object({
  foodType: z.string().min(1, 'Food type is required'),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.string().min(1, 'Unit is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;
type MealPlanFormData = z.infer<typeof mealPlanSchema>;

export default function PetDetails() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'meals'>(
    'appointments'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentFilter, setAppointmentFilter] = useState<
    'all' | 'upcoming' | 'completed'
  >('all');
  const [appointmentSort, setAppointmentSort] = useState<
    'date-asc' | 'date-desc'
  >('date-asc');
  const [mealPlanSort, setMealPlanSort] = useState<'type' | 'amount'>('type');
  const [deleteType, setDeleteType] = useState<{
    type: 'pet' | 'appointment' | 'mealPlan';
    id: number;
  } | null>(null);

  const [recentChanges, setRecentChanges] = useState<
    {
      type: 'appointment' | 'mealPlan' | 'pet';
      action: 'added' | 'updated' | 'deleted';
      description: string;
      timestamp: Date;
      petId?: number;
    }[]
  >([]);

  const appointmentForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const mealPlanForm = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanSchema),
  });

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);

  useEffect(() => {
    fetchPetDetails();
    fetchAppointments();
    fetchMealPlans();
  }, [params.id]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`/api/pets?id=${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch pet details');
      const data = await response.json();
      setPet(data);
    } catch (error) {
      toast.error('Failed to load pet details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const response = await fetch(`/api/appointments?petId=${params.id}`);
    const data = await response.json();
    setAppointments(data);
  };

  const fetchMealPlans = async () => {
    const response = await fetch(`/api/mealplans?petId=${params.id}`);
    const data = await response.json();
    setMealPlans(data);
  };

  const handleDelete = async () => {
    if (!deleteType) return;

    const { type, id } = deleteType;
    let promise;
    let changeDescription = '';

    switch (type) {
      case 'pet':
        changeDescription = `Deleted pet: ${pet.name}`;
        promise = fetch(`/api/pets?id=${id}`, { method: 'DELETE' }).then(
          async (response) => {
            if (!response.ok) throw new Error('Failed to delete pet');
            router.push('/');
          }
        );
        break;
      case 'appointment': {
        const apt = appointments.find((a) => a.id === id);
        changeDescription = `Deleted ${apt?.type} appointment for ${pet.name}`;
        promise = fetch(`/api/appointments?id=${id}`, {
          method: 'DELETE',
        }).then(async (response) => {
          if (!response.ok) throw new Error('Failed to delete appointment');
          fetchAppointments();
        });
        break;
      }
      case 'mealPlan': {
        const plan = mealPlans.find((m) => m.id === id);
        changeDescription = `Deleted ${plan?.foodType} meal plan for ${pet.name}`;
        promise = fetch(`/api/mealplans?id=${id}`, { method: 'DELETE' }).then(
          async (response) => {
            if (!response.ok) throw new Error('Failed to delete meal plan');
            fetchMealPlans();
          }
        );
        break;
      }
    }

    if (promise) {
      promise.then(() => {
        setRecentChanges((prev) =>
          [
            {
              type,
              action: 'deleted',
              description: changeDescription,
              timestamp: new Date(),
              petId: parseInt(params.id as string),
            } as const,
            ...prev,
          ].slice(0, 20)
        );
      });

      toast.promise(promise, {
        loading: `Deleting ${type}...`,
        success: `${type} deleted successfully!`,
        error: (err) => err.message,
      });
    }

    setDeleteType(null);
  };

  const isUpcoming = (date: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    return appointmentDate > today && appointmentDate <= twoWeeksFromNow;
  };

  const upcomingAppointments = appointments.filter((apt) => {
    return isUpcoming(apt.date) && !apt.completed;
  });

  // Add a new appointment filter to appointments
  const filteredAndSortedAppointments = appointments
    .filter((apt) => {
      if (appointmentFilter === 'all') return true;
      if (appointmentFilter === 'upcoming')
        return new Date(apt.date) > new Date();
      return apt.completed;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return appointmentSort === 'date-asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

  const sortedMealPlans = [...mealPlans].sort((a, b) => {
    if (mealPlanSort === 'type') {
      return a.foodType.localeCompare(b.foodType);
    }
    return parseFloat(a.amount) - parseFloat(b.amount);
  });

  const shortcuts = {
    newAppointment: {
      combo: { key: 'a', ctrl: true },
      callback: () => setShowAppointmentForm(true),
      description: 'Add new appointment',
    },
    newMealPlan: {
      combo: { key: 'm', ctrl: true },
      callback: () => setShowMealPlanForm(true),
      description: 'Add new meal plan',
    },
    back: {
      combo: { key: 'b', ctrl: true },
      callback: () => window.history.back(),
      description: 'Go back to pets list',
    },
  };

  if (isLoading) return <LoadingSpinner />;

  const onSubmitAppointment = async (data: AppointmentFormData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, petId: parseInt(params.id as string) }),
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      const newAppointment = await response.json();
      setAppointments((prev) => [...prev, newAppointment]);
      appointmentForm.reset();
      setShowAppointmentForm(false);

      setRecentChanges((prev) =>
        [
          {
            type: 'appointment',
            action: 'added',
            description: `Added ${data.type} appointment for ${pet.name}`,
            timestamp: new Date(),
            petId: parseInt(params.id as string),
          } as const,
          ...prev,
        ].slice(0, 20)
      );

      toast.success('Appointment created successfully!');
    } catch (error) {
      toast.error('Failed to create appointment');
    }
  };

  const onSubmitMealPlan = async (data: MealPlanFormData) => {
    try {
      const response = await fetch('/api/mealplans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, petId: parseInt(params.id as string) }),
      });

      if (!response.ok) throw new Error('Failed to create meal plan');

      const newMealPlan = await response.json();
      setMealPlans((prev) => [...prev, newMealPlan]);
      mealPlanForm.reset();
      setShowMealPlanForm(false);

      setRecentChanges((prev) =>
        [
          {
            type: 'mealPlan',
            action: 'added',
            description: `Added ${data.foodType} meal plan for ${pet.name}`,
            timestamp: new Date(),
            petId: parseInt(params.id as string),
          } as const,
          ...prev,
        ].slice(0, 20)
      );

      toast.success('Meal plan created successfully!');
    } catch (error) {
      toast.error('Failed to create meal plan');
    }
  };

  const toggleAppointmentComplete = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/appointments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error('Failed to update appointment');

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, completed } : apt))
      );

      const appointment = appointments.find((apt) => apt.id === id);
      setRecentChanges((prev) =>
        [
          {
            type: 'appointment',
            action: 'updated',
            description: `Marked ${appointment?.type} appointment as ${completed ? 'completed' : 'incomplete'}`,
            timestamp: new Date(),
            petId: parseInt(params.id as string),
          } as const,
          ...prev,
        ].slice(0, 20)
      );

      toast.success('Appointment updated successfully!');
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  return (
    <ErrorBoundary>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-emerald-600 mt-1">
                {pet.species} {pet.breed ? `• ${pet.breed}` : ''}
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-emerald-700 border-2 border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() =>
                  setDeleteType({
                    type: 'pet',
                    id: parseInt(params.id as string),
                  })
                }
                className="px-4 py-2 text-red-600 border-2 border-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                Delete Pet
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pet Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">
                    Species:{' '}
                    <span className="text-gray-800">{pet.species}</span>
                  </p>
                  {pet.breed && (
                    <p className="text-gray-600">
                      Breed: <span className="text-gray-800">{pet.breed}</span>
                    </p>
                  )}
                </div>
                <div>
                  {pet.birthDate && (
                    <p className="text-gray-600">
                      Birth Date:{' '}
                      <span className="text-gray-800">
                        {new Date(pet.birthDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {pet.weight && (
                    <p className="text-gray-600">
                      Weight:{' '}
                      <span className="text-gray-800">{pet.weight}kg</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('appointments')}
              >
                Appointments
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'meals' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('meals')}
              >
                Meal Plans
              </button>
            </nav>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div className="space-x-4">
                    <select
                      value={appointmentFilter}
                      onChange={(e) =>
                        setAppointmentFilter(e.target.value as any)
                      }
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="all">All Appointments</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      value={appointmentSort}
                      onChange={(e) =>
                        setAppointmentSort(e.target.value as any)
                      }
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="date-asc">Date (Oldest First)</option>
                      <option value="date-desc">Date (Newest First)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    New Appointment
                  </h3>
                  <form
                    onSubmit={appointmentForm.handleSubmit(onSubmitAppointment)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <input
                          {...appointmentForm.register('type')}
                          placeholder="Appointment Type"
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${appointmentForm.formState.errors.type ? 'border-red-500' : 'border-gray-300'} `}
                        />
                        {appointmentForm.formState.errors.type && (
                          <p className="text-red-500 text-sm mt-1">
                            {appointmentForm.formState.errors.type.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-1">
                        <input
                          type="datetime-local"
                          {...appointmentForm.register('date')}
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${appointmentForm.formState.errors.date ? 'border-red-500' : 'border-gray-300'}
                          `}
                        />
                        {appointmentForm.formState.errors.date && (
                          <p className="text-red-500 text-sm mt-1">
                            {appointmentForm.formState.errors.date.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <input
                          {...appointmentForm.register('description')}
                          placeholder="Description (optional)"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                    >
                      Add Appointment
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {filteredAndSortedAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No appointments found
                    </p>
                  ) : (
                    filteredAndSortedAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`bg-white p-4 rounded-lg shadow-sm border ${appointment.completed ? 'border-emerald-200 bg-emerald-50' : isUpcoming(appointment.date) ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={appointment.completed}
                                  onChange={(e) =>
                                    toggleAppointmentComplete(
                                      appointment.id,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <h3 className="font-semibold text-gray-800">
                                  {appointment.type}
                                </h3>
                                {isUpcoming(appointment.date) &&
                                  !appointment.completed && (
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                      Upcoming
                                    </span>
                                  )}
                              </div>
                              <span
                                className={`text-sm ${new Date(appointment.date) < new Date() ? 'text-red-500' : 'text-emerald-600'}`}
                              >
                                {new Date(appointment.date).toLocaleString()}
                              </span>
                            </div>
                            {appointment.description && (
                              <p className="text-gray-600 mt-2 text-sm">
                                {appointment.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              setDeleteType({
                                type: 'appointment',
                                id: appointment.id,
                              })
                            }
                            className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                          >
                            <svg
                              xmlns="http://www.w3.org/200/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'meals' && (
              <motion.div
                key="meals"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex justify-end mb-4">
                  <select
                    value={mealPlanSort}
                    onChange={(e) => setMealPlanSort(e.target.value as any)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="type">Sort by Food Type</option>
                    <option value="amount">Sort by Amount</option>
                  </select>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    New Meal Plan
                  </h3>
                  <form
                    onSubmit={mealPlanForm.handleSubmit(onSubmitMealPlan)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <input
                          {...mealPlanForm.register('foodType')}
                          placeholder="Food Type"
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${mealPlanForm.formState.errors.foodType ? 'border-red-500' : 'border-gray-300'} `}
                        />
                        {mealPlanForm.formState.errors.foodType && (
                          <p className="text-red-500 text-sm mt-1">
                            {mealPlanForm.formState.errors.foodType.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-1 flex space-x-2">
                        <div className="flex-1">
                          <input
                            {...mealPlanForm.register('amount')}
                            type="number"
                            step="0.1"
                            placeholder="Amount"
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${mealPlanForm.formState.errors.amount ? 'border-red-500' : 'border-gray-300'} `}
                          />
                          {mealPlanForm.formState.errors.amount && (
                            <p className="text-red-500 text-sm mt-1">
                              {mealPlanForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>
                        <div className="w-24">
                          <input
                            {...mealPlanForm.register('unit')}
                            placeholder="Unit"
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${mealPlanForm.formState.errors.unit ? 'border-red-500' : 'border-gray-300'} `}
                          />
                          {mealPlanForm.formState.errors.unit && (
                            <p className="text-red-500 text-sm mt-1">
                              {mealPlanForm.formState.errors.unit.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <input
                          {...mealPlanForm.register('frequency')}
                          placeholder="Frequency"
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${mealPlanForm.formState.errors.frequency ? 'border-red-500' : 'border-gray-300'} `}
                        />
                        {mealPlanForm.formState.errors.frequency && (
                          <p className="text-red-500 text-sm mt-1">
                            {mealPlanForm.formState.errors.frequency.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-1">
                        <input
                          {...mealPlanForm.register('notes')}
                          placeholder="Notes (optional)"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                    >
                      Add Meal Plan
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {sortedMealPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">
                              {plan.foodType}
                            </h3>
                            <span className="text-emerald-600">
                              {plan.amount} {plan.unit}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Frequency: {plan.frequency}
                          </p>
                          {plan.notes && (
                            <p className="text-gray-500 text-sm mt-2">
                              {plan.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setDeleteType({ type: 'mealPlan', id: plan.id })
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/200/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ConfirmDialog
          isOpen={deleteType !== null}
          onClose={() => setDeleteType(null)}
          onConfirm={handleDelete}
          title={`Delete ${deleteType?.type === 'pet' ? 'Pet' : deleteType?.type === 'appointment' ? 'Appointment' : 'Meal Plan'}`}
          message={
            deleteType?.type === 'pet'
              ? 'Are you sure you want to delete this pet? This action cannot be undone, and all associated appointments and meal plans will be deleted.'
              : `Are you sure you want to delete this ${deleteType?.type}? This action cannot be undone.`
          }
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        <WhatsNew
          upcomingAppointments={upcomingAppointments}
          recentChanges={recentChanges}
        />

        <KeyboardShortcuts shortcuts={shortcuts} />
      </motion.main>
    </ErrorBoundary>
  );
}
