import { dbConn } from './db';
import { Book } from '../types';
import { UUID } from 'crypto';
import { randomUUID } from 'crypto';

export const getBooksByPrice = (minPrice: number = 0, maxPrice: number = 1000) => {
  const db = dbConn();
  const query = db.query(
    'SELECT * FROM books WHERE price >= $minPrice AND price <= $maxPrice LIMIT 20'
  );
  return query.all({
    $minPrice: minPrice,
    $maxPrice: maxPrice,
  }) as Book[];
};

export const getBookById = (id: UUID) => {
  const db = dbConn();
  const query = db.query('SELECT * FROM books WHERE id = $id');
  return query.get({
    $id: id,
  }) as Book;
}

export const createBook = (book: Omit<Book, 'id'>) => {
  const db = dbConn();
  const query = db.query(
    `
    INSERT INTO books (id, title, author, genre, price)
    VALUES ($id, $title, $author, $genre, $price)
    RETURNING *;
    `
  );
  return query.get({
    $id: randomUUID(),
    $title: book.title,
    $author: book.author,
    $genre: book.genre,
    $price: book.price,
  }) as Book;
}