import { BASE_API } from "./utils";

export type Author = {
  id: string;
  name: string;
};

export type Book = {
  id: string;
  isbn: string;
  title: string;
  coverUrl: string;
  description: string;
  year: number;
  bookAuthors: { author: Author }[];
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type FindBooksParams = {
  page: number;
  pageSize: number;
};

export async function fetchBooks({
  page,
  pageSize,
}: FindBooksParams): Promise<PaginatedResult<Book>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await fetch(`${BASE_API}/books?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }
  return response.json();
}
