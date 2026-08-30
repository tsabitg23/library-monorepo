"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/pagination";
import { fetchBooks } from "@/lib/books";
import { EmptyBooks } from "@/components/empty-books";
import { BASE_API } from "@/lib/utils";

const pageSizeOptions = [4, 8, 12];

export function BookCatalogue() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPage = Number(searchParams.get("page")) || 1;
  const requestedPageSize = Number(searchParams.get("pageSize"));
  const pageSize = pageSizeOptions.includes(requestedPageSize)
    ? requestedPageSize
    : 8;

  const activeFilters = {
    title: searchParams.get("title") || undefined,
    isbn: searchParams.get("isbn") || undefined,
    author: searchParams.get("author") || undefined,
    publisher: searchParams.get("publisher") || undefined,
    tags: searchParams.get("tags") || undefined,
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  const isSearchPage = pathname === "/book_search";
  const shouldShowEmptyState = isSearchPage && !hasActiveFilters;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["books", requestedPage, pageSize, activeFilters],
    queryFn: () => fetchBooks({ page: requestedPage, pageSize, ...activeFilters }),
    enabled: !shouldShowEmptyState,
  });

  const books = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const updatePagination = (page: number, nextPageSize = pageSize) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("pageSize", String(nextPageSize));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section aria-labelledby="catalogue-heading">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">The collection</p>
          <h1 id="catalogue-heading" className="text-3xl font-semibold tracking-tight">
            Find your next read
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => updatePagination(1, Number(value))}
          >
            <SelectTrigger aria-label="Books per page" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {shouldShowEmptyState ? (
        <EmptyBooks
          title="Start searching"
          description="Search by title, author, ISBN, or tag to find books in the collection."
        />
      ) : isError ? (
        <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
          Failed to load books. Please try again later.
        </div>
      ) : isLoading ? (
        <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
          Loading books...
        </div>
      ) : books.length === 0 ? (
        <EmptyBooks
          title="No books match your search"
          description="Try a different title, author, ISBN, or tag to refine your results."
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group block">
              <Card className="h-full gap-0 rounded-md py-0 transition-shadow group-hover:shadow-md">
                <div className="aspect-[2/3] overflow-hidden bg-muted">
                  <img
                    src={`${BASE_API}/${book.coverUrl}`}
                    alt={`Cover of ${book.title}`}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <CardHeader className="gap-1 px-3 py-3 sm:px-4">
                  <CardTitle className="line-clamp-2 text-sm sm:text-base">{book.title}</CardTitle>
                  <CardDescription className="line-clamp-1 text-xs">
                    {book.bookAuthors.map((bookAuthor) => bookAuthor.author.name).join(", ")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          Page {requestedPage} of {Math.max(totalPages, 1)}
        </p>
        <Pagination className="mx-0 w-auto" aria-label="Book list pagination">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={requestedPage <= 1}
                onClick={() => updatePagination(requestedPage - 1)}
              >
                <ChevronLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={requestedPage >= totalPages || books.length === 0}
                onClick={() => updatePagination(requestedPage + 1)}
              >
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}