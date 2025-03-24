'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { PetFormData, petSchema } from '../schemas/pets';

const prisma = new PrismaClient();

export async function getPets() {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        appointments: true,
        mealPlans: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return pets;
  } catch (error) {
    console.error('Failed to fetch pets:', error);
    return [];
  }
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

  try {
    const pet = await prisma.pet.create({
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        weight: data.weight ? parseFloat(data.weight.toString()) : undefined,
      },
      include: {
        appointments: true,
        mealPlans: true,
      },
    });
    revalidatePath('/');
    return { data: pet };
  } catch (error) {
    console.error('Failed to create pet:', error);
    return {
      error: 'Failed to create pet. Please try again.',
    };
  }
}

export async function deletePet(id: number) {
  try {
    await prisma.pet.delete({
      where: {
        id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to delete pet:', error);
    throw new Error('Failed to delete pet. Please try again.');
  }
}
