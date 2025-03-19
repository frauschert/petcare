import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get('petId');

  try {
    const appointments = await prisma.appointment.findMany({
      where: petId ? { petId: parseInt(petId) } : {},
      include: {
        pet: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const appointment = await prisma.appointment.create({
      data: {
        petId: parseInt(body.petId),
        type: body.type,
        date: new Date(body.date),
        description: body.description,
        completed: body.completed || false,
      },
      include: {
        pet: true,
      },
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const appointment = await prisma.appointment.update({
      where: {
        id: parseInt(body.id),
      },
      data: {
        type: body.type,
        date: new Date(body.date),
        description: body.description,
        completed: body.completed,
      },
      include: {
        pet: true,
      },
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Appointment ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
