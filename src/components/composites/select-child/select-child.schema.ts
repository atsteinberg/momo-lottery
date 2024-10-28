import { z } from 'zod';

export const FormSchema = z
  .object({
    kid: z.string({ required_error: 'Bitte wähle den Namen Deines Kindes' }),
    newKid: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.kid === 'new') {
        return !!data.newKid && data.newKid.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Bitte gib den Namen des neuen Kindes ein',
      path: ['newKid'],
    },
  );

export type SelectChildFormValues = z.infer<typeof FormSchema>;
