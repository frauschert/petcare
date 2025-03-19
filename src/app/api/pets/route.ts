import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        appointments: true,
        mealPlans: true,
      },
    });
    return NextResponse.json(pets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pet = await prisma.pet.create({
      data: {
        name: body.name,
        species: body.species,
        breed: body.breed,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        weight: body.weight ? parseFloat(body.weight) : null,
      },
    });
    return NextResponse.json(pet);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Pet ID is required' }, { status: 400 });
  }

  try {
    await prisma.pet.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }
}
