import { expect, it } from 'bun:test'
import { getBookById, createBook } from './queries'

it('should return the book by id', () => {
  const bookId = '0baed8b0-65f6-4211-9f50-aee38918413a'
  const book = getBookById(bookId)
  expect(book).toBeDefined()
  expect(book.id).toBe(bookId)
  expect(book.title).toBe('It')
  expect(book.author).toBe('Mikhail Bulgakov')
})

it('should create a book', () => {
  const body = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Test Genre',
    price: 10,
  }
  const book = createBook(body)
  expect(book).toBeDefined()
  expect(book.id).toBeDefined()
  expect(book.title).toBe(body.title)
  expect(book.author).toBe(body.author)
  expect(book.genre).toBe(body.genre)
  expect(book.price).toBe(body.price)
})