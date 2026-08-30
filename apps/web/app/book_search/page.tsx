import { Suspense } from "react";
import { BookCatalogue } from "@/components/book-catalogue";

export default function BookSearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Suspense>
          <BookCatalogue />
        </Suspense>
      </main>
    </div>
  );
}
