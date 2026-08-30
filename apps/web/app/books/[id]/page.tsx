import { notFound } from "next/navigation";
import { fetchBook } from "@/lib/books";
import { BookDetailContent } from "./book-detail-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const book = await fetchBook(id);
    return {
      title: book.title,
      description: book.description,
    };
  } catch {
    return {
      title: "Book not found",
    };
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const book = await fetchBook(id);
    return <BookDetailContent book={book} />;
  } catch (error) {
    notFound();
  }
}