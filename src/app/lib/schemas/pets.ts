import { z } from 'zod';

export const petSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().optional(),
  birthDate: z.string().optional(),
  weight: z.preprocess((val) => Number(val), z.number()).optional(),
});

export type PetFormData = z.infer<typeof petSchema>;
