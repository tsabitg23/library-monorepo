"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book } from "@/lib/books";
import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/lib/cart-store";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { ShoppingCart } from "lucide-react";
import { toast } from "@repo/ui/sonner";
import { BASE_API } from "@/lib/utils";

type BookDetailContentProps = {
  book: Book;
};

export function BookDetailContent({ book }: BookDetailContentProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isBookInCart = hasMounted && isInCart(book.id);
  const canAddToCart = hasMounted && isLoggedIn;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isInCart(book.id)) {
      toast.error("Book already in the cart");
      return;
    }

    setIsAdding(true);
    try {
      const success = addToCart({
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
      });

      if (success) {
        toast.success("Added to cart");
      } else {
        toast.error("Book already in the cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const authors =
    book.bookAuthors?.map((ba) => ba.author?.name).filter(Boolean) || [];
  const tags =
    book.bookTags?.map((bt) => bt.tag?.name).filter(Boolean) || [];

  const searchLink = (param: string, value: string) =>
    `/book_search?${param}=${encodeURIComponent(value)}`;

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile and Tablet View (Single Column) */}
        <div className="block lg:hidden">
          <div className="mb-8 flex flex-col gap-6">
            {/* Cover Image */}
            <div className="flex justify-center">
              <div className="relative h-80 w-56 overflow-hidden rounded-lg shadow-md">
                <img
                  src={`${BASE_API}/${book.coverUrl}`}
                  alt={book.title}
                  style={{ width: "100%", height: "100%" }}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{book.title}</h1>

              {/* Authors */}
              {authors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Authors
                  </h3>
                  <p className="text-base">
                    {authors.map((author, index) => (
                      <span key={author}>
                        {index > 0 && ", "}
                        <Link
                          href={searchLink("author", author as string)}
                          className="hover:underline"
                        >
                          {author}
                        </Link>
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {/* Publisher and Year */}
              <div className="space-y-2">
                {book.publisher && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Publisher
                    </h3>
                    <p className="text-base">
                      <Link
                        href={searchLink("publisher", book.publisher.name)}
                        className="hover:underline"
                      >
                        {book.publisher.name}
                      </Link>
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Year
                  </h3>
                  <p className="text-base">{book.year}</p>
                </div>
              </div>

              {/* ISBN */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  ISBN
                </h3>
                <p className="text-base font-mono">{book.isbn}</p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag} href={searchLink("tags", tag as string)}>
                        <Badge variant="secondary">{tag}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Description
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {book.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || isBookInCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isBookInCart
                  ? "Already in Cart"
                  : canAddToCart
                    ? "Add to Cart"
                    : "Login to Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop View (Two Column) */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column: Cover Image */}
          <div className="flex items-start justify-center">
            <div className="sticky top-8 h-80 w-56 overflow-hidden rounded-lg shadow-md">
              <img
                src={`${BASE_API}/${book.coverUrl}`}
                alt={book.title}
                width={224}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Book Details */}
          <div className="col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{book.title}</h1>

            {/* Authors */}
            {authors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Authors
                </h3>
                <p className="text-lg">
                  {authors.map((author, index) => (
                    <span key={author}>
                      {index > 0 && ", "}
                      <Link
                        href={searchLink("author", author as string)}
                        className="hover:underline"
                      >
                        {author}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Publisher and Year */}
            <div className="grid grid-cols-2 gap-4">
              {book.publisher && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Publisher
                  </h3>
                  <p className="text-base">
                    <Link
                      href={searchLink("publisher", book.publisher.name)}
                      className="hover:underline"
                    >
                      {book.publisher.name}
                    </Link>
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Year
                </h3>
                <p className="text-base">{book.year}</p>
              </div>
            </div>

            {/* ISBN */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">
                ISBN
              </h3>
              <p className="text-base font-mono">{book.isbn}</p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag} href={searchLink("tags", tag as string)}>
                      <Badge variant="secondary">{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                Description
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                {book.description}
              </p>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isBookInCart}
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isBookInCart
                ? "Already in Cart"
                : canAddToCart
                  ? "Add to Cart"
                  : "Login to Add to Cart"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
