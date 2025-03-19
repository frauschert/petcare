import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get('petId');

  try {
    const mealPlans = await prisma.mealPlan.findMany({
      where: petId ? { petId: parseInt(petId) } : {},
      include: {
        pet: true,
      },
    });
    return NextResponse.json(mealPlans);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mealPlan = await prisma.mealPlan.create({
      data: {
        petId: parseInt(body.petId),
        foodType: body.foodType,
        amount: parseFloat(body.amount),
        unit: body.unit,
        frequency: body.frequency,
        notes: body.notes,
      },
      include: {
        pet: true,
      },
    });
    return NextResponse.json(mealPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create meal plan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const mealPlan = await prisma.mealPlan.update({
      where: {
        id: parseInt(body.id),
      },
      data: {
        foodType: body.foodType,
        amount: parseFloat(body.amount),
        unit: body.unit,
        frequency: body.frequency,
        notes: body.notes,
      },
      include: {
        pet: true,
      },
    });
    return NextResponse.json(mealPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update meal plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Meal Plan ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.mealPlan.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete meal plan' },
      { status: 500 }
    );
  }
}
