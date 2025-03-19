import { ErrorBoundary } from '../components/ErrorBoundary';
import WhatsNew from '../components/WhatsNew';
import { getAppointments } from '@/app/lib/services/appointments';
import { AppointmentStats } from '../components/AppointmentStats';
import { MealplanStats } from '../components/MealplanStats';

export default async function Home() {
  const upcomingAppointments = await getAppointments();

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppointmentStats appointments={upcomingAppointments ?? []} />
            <MealplanStats mealPlans={[]} />
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
