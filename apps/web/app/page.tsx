import { TopNavBar } from "@/components/top-nav-bar";
import { BookCatalogue } from "@/components/book-catalogue";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TopNavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Suspense>
          <BookCatalogue />
        </Suspense>
      </main>
    </div>
  );
}
