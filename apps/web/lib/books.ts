import { BASE_API } from "./utils";

export type Author = {
  id: string;
  name: string;
};

export type Publisher = {
  id: string;
  name: string;
};

export type Tag = {
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
  publisher?: Publisher;
  bookAuthors: { author: Author }[];
  bookTags?: { tag: Tag }[];
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type BookSearchFilters = {
  title?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  tags?: string;
};

export type FindBooksParams = BookSearchFilters & {
  page: number;
  pageSize: number;
};

export async function fetchBooks({
  page,
  pageSize,
  title,
  isbn,
  author,
  publisher,
  tags,
}: FindBooksParams): Promise<PaginatedResult<Book>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const filters: BookSearchFilters = { title, isbn, author, publisher, tags };
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string" && value.trim().length > 0) {
      params.set(key, value.trim());
    }
  }

  const response = await fetch(`${BASE_API}/books?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }
  return response.json();
}

export async function fetchBook(id: string): Promise<Book> {
  const response = await fetch(`${BASE_API}/books/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Book not found");
    }
    throw new Error(`Failed to fetch book: ${response.status}`);
  }
  return response.json();
}
