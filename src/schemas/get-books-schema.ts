import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const schema = z
  .object({
    minPrice: z
      .string()
      .optional()
      .default('0')
      .refine((val) => Number(val) >= 0 && Number(val) <= 1000, {
        message: 'minPrice must be a number between 0 and 1000',
      })
      .transform((val) => Number(val)),
    maxPrice: z
      .string()
      .optional()
      .default('1000')
      .refine((val) => Number(val) >= 0 && Number(val) <= 1000, {
        message: 'maxPrice must be a number between 0 and 1000',
      })
      .transform((val) => Number(val)),
  })
  .strict({ message: 'Only minPrice and maxPrice are valid query params' })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: 'minPrice must be less than or equal to maxPrice',
  });

export const getBookValidator = zValidator('query', schema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});