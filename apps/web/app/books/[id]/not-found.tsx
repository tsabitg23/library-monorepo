import Link from "next/link";
import { Button } from "@repo/ui/button";
import { EmptyBooks } from "@/components/empty-books";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyBooks
          title="Book not found"
          description="The book you're looking for doesn't exist or has been removed."
        />
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
