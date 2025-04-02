import { Hono } from 'hono'
import { getBookValidator } from './schemas/get-books-schema';
import { getBooksByPrice, getBookById } from './db/queries';
import { getBookByIdValidator } from './schemas/get-book-by-id-schema';

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello World!' }))

app.get('/books', getBookValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

app.get('/books/:bookId', getBookByIdValidator, (c) => {
  const { bookId } = c.req.valid('param');

  const book = getBookById(bookId);

  if (!book) {
    return c.json({ message: 'No book found' }, 404);
  }

  return c.json(book);
})

export default app
