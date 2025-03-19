'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { PetFormData, petSchema } from '../schemas/pets';

const prisma = new PrismaClient();

export async function getPets() {
  const pets = await prisma.pet.findMany({
    include: {
      appointments: true,
      mealPlans: true,
    },
  });
  return pets;
}

export async function createPet(data: PetFormData) {
  const result = petSchema.safeParse(data);
  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }
  const pet = await prisma.pet.create({
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
  revalidatePath('/pets');
  return { data: pet };
}

export async function deletePet(id: number) {
  await prisma.pet.delete({
    where: {
      id,
    },
  });
}
