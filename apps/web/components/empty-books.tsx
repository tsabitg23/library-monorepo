import { LibraryBig } from "lucide-react";

type EmptyBooksProps = {
  title?: string;
  description?: string;
};

export function EmptyBooks({
  title = "No books on this page",
  description = "Try another page to continue exploring the collection.",
}: EmptyBooksProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center border-y border-border px-6 text-center">
      <LibraryBig className="mb-4 size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
