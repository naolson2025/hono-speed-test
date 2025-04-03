import { Hono } from 'hono'
import { getBookValidator } from './schemas/get-books-schema';
import { getBooksByPrice, getBookById, createBook } from './db/queries';
import { getBookByIdValidator } from './schemas/get-book-by-id-schema';
import { UUID } from 'crypto';
import { createBookValidator } from './schemas/create-book-schema';
import decoys from './decoy-routes';

const books = new Hono()

books.get('/', (c) => c.json({ message: 'Hello World!' }))

books.get('/books', getBookValidator, (c) => {
  const { minPrice, maxPrice } = c.req.valid('query');

  const books = getBooksByPrice(minPrice, maxPrice);

  return c.json(books);
});

books.get('/books/:bookId', getBookByIdValidator, (c) => {
  const { bookId } = c.req.valid('param');

  const book = getBookById(bookId as UUID);

  if (!book) {
    return c.json({ message: 'No book found' }, 404);
  }

  return c.json(book);
})

books.post('/books', createBookValidator, (c) => {
  const book = c.req.valid('json');

  const createdBook = createBook(book);

  return c.json(createdBook, 201);
})


const app = new Hono()
// routing priority, decoys first
app.route('/', decoys)
app.route('/', books)

export default app
