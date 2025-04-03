import { Hono } from 'hono'
import { getBookValidator } from './schemas/get-books-schema';
import { getBooksByPrice, getBookById, createBook } from './db/queries';
import { getBookByIdValidator } from './schemas/get-book-by-id-schema';
import { UUID } from 'crypto';
import { createBookValidator } from './schemas/create-book-schema';

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello World!' }))

app.get('/books', getBookValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

app.get('/books/:bookId', getBookByIdValidator, (c) => {
  const { bookId } = c.req.valid('param');

  const book = getBookById(bookId as UUID);

  if (!book) {
    return c.json({ message: 'No book found' }, 404);
  }

  return c.json(book);
})

app.post('/books', createBookValidator, (c) => {
  const book = c.req.valid('json');

  const createdBook = createBook(book);

  return c.json(createdBook, 201);
})

export default app
