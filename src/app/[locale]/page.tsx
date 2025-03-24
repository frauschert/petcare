import { ErrorBoundary } from '../components/ErrorBoundary';
import WhatsNew from '../components/WhatsNew';
import { getAppointments } from '@/app/lib/services/appointments';
import { AppointmentStats } from '../components/AppointmentStats';
import { MealplanStats } from '../components/MealplanStats';
import { PetList } from '../components/PetList';
import { getPets } from '@/app/lib/services/pets';

export default async function Home() {
  const upcomingAppointments = await getAppointments();
  const pets = await getPets();

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Pet Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentStats appointments={upcomingAppointments ?? []} />
            <MealplanStats mealPlans={[]} />
          </div>

          <div className="bg-surface-tonal-a20 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Your Pets
              </h2>
            </div>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No pets added yet</p>
              </div>
            ) : (
              <PetList pets={pets} />
            )}
          </div>

          <WhatsNew
            upcomingAppointments={upcomingAppointments ?? []}
            recentChanges={[]}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
}
