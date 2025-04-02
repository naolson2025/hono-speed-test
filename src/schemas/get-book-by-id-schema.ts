import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const schema = z.object({
  bookId: z.string().uuid(),
});

export const getBookByIdValidator = zValidator('param', schema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});
