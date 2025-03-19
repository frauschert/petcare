import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAppointments(petId?: string) {
  const appointments = await prisma.appointment.findMany({
    where: petId ? { petId: parseInt(petId) } : {},
    include: {
      pet: true,
    },
    orderBy: {
      date: 'asc',
    },
  });
  return appointments;
}
