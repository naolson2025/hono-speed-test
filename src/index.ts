import { Hono } from 'hono'
import { getBookValidator } from './schemas/get-book-schema';
import { getBooksByPrice } from './db/queries';

const app = new Hono()

app.get('/books', getBookValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

export default app
