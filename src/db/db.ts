import { Database } from 'bun:sqlite';
import { join } from 'path';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

const makeBook = () => ({
  id: randomUUID(),
  title: faker.book.title(),
  author: faker.book.author(),
  genre: faker.book.genre(),
  price: Number(faker.commerce.price()),
});

// set to root directory
const dbPath = join('.', 'books.sqlite');

let db: Database;

export const dbConn = () => {
  if (!db) {
    db = new Database(dbPath);
    db.exec('PRAGMA journal_mode = WAL;');

    db.exec(`
      CREATE TABLE IF NOT EXISTS Books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        genre TEXT NOT NULL,
        price REAL NOT NULL
      );
    `);

    // if the table is empty, insert 100 random books
    const count = db.query('SELECT COUNT(*) as count FROM Books;').get() as {
      count: number;
    };
    if (count.count > 0) {
      console.log('Database already seeded');
      return db;
    }

    const insertBookQuery = db.query(
      `INSERT INTO Books (id, title, author, genre, price) VALUES (@id, @title, @author, @genre, @price);`
    );
    for (let i = 0; i < 100; i++) {
      const book = makeBook();
      insertBookQuery.run(
        book.id,
        book.title,
        book.author,
        book.genre,
        book.price
      );
    }

    console.log('Database connection established');
  }
  return db;
};
