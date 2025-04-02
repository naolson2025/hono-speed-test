import { expect, it } from 'bun:test'
import { getBookById } from './queries'

it('should return the book by id', () => {
  const bookId = '0baed8b0-65f6-4211-9f50-aee38918413a'
  const book = getBookById(bookId)
  expect(book).toBeDefined()
  expect(book.id).toBe(bookId)
  expect(book.title).toBe('It')
  expect(book.author).toBe('Mikhail Bulgakov')
})