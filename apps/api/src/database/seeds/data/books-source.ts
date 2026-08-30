import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface BookSourceData {
  author: string;
  country: string;
  imageLink: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
}

// packages/data/books.json lives outside the api app, resolve it relative to this file
const booksJsonPath = resolve(
  __dirname,
  '../../../../../../packages/data/books.json',
);

export const booksData: BookSourceData[] = JSON.parse(
  readFileSync(booksJsonPath, 'utf-8'),
);
