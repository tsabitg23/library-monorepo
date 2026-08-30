import { LibraryBig } from "lucide-react";

export function EmptyBooks() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center border-y border-border px-6 text-center">
      <LibraryBig className="mb-4 size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold">No books on this page</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try another page to continue exploring the collection.
      </p>
    </div>
  );
}
