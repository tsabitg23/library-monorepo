"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import {
  BookCondition,
  BookLoan,
  BookLoanStatus,
  fetchBorrowHistory,
  isSevereReturnCondition,
} from "@/lib/borrows";
import { toast } from "@repo/ui/sonner";
import { Badge } from "@repo/ui/badge";
import { BASE_API } from "@/lib/utils";
import { ReturnBookDialog } from "@/components/return-book-dialog";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCondition(condition: string) {
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

function isOverdue(deadline: string) {
  return new Date(deadline).getTime() < Date.now();
}

export default function BorrowPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleReturnSuccess = (updatedLoan: BookLoan) => {
    setLoans((currentLoans) =>
      currentLoans.map((loan) =>
        loan.id === updatedLoan.id ? updatedLoan : loan,
      ),
    );
  };

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    fetchBorrowHistory(accessToken)
      .then(setLoans)
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load borrow list.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </main>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-semibold">Borrow List</h1>
          <p className="text-muted-foreground">
            Please log in to view your borrow list.
          </p>
        </main>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-semibold">Borrow List</h1>
          <div className="flex flex-col items-center justify-center border-y border-border py-12">
            <h2 className="text-lg font-semibold">You have no borrowed books</h2>
            <p className="mt-2 text-muted-foreground">
              Books you borrow will show up here
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-semibold">Borrow List</h1>

        {/* Mobile Layout */}
        <div className="block space-y-4 lg:hidden">
          {loans.map((loan) => {
            const isReturned = loan.status === BookLoanStatus.RETURNED;
            const showOverdueBadge = !isReturned && isOverdue(loan.returnDeadline);
            const showRedReturnedBadge =
              isReturned && isSevereReturnCondition(loan);

            return (
              <div
                key={loan.id}
                className="flex gap-4 border border-border rounded-lg p-4"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded">
                  <img
                    src={`${BASE_API}/${loan.bookInventory?.book?.coverUrl}`}
                    alt={loan.bookInventory?.book?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/books/${loan.bookInventory?.book?.id}`}
                    className="font-semibold hover:underline"
                  >
                    {loan.bookInventory?.book?.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {loan.bookInventory?.book?.isbn}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <Badge variant="secondary">
                      {formatCondition(loan.checkoutCondition)}
                    </Badge>
                    <span className="text-muted-foreground">
                      Due {formatDate(loan.returnDeadline)}
                    </span>
                    {isReturned ? (
                      showRedReturnedBadge ? (
                        <Badge variant="destructive">Returned</Badge>
                      ) : (
                        <Badge variant="success">Returned</Badge>
                      )
                    ) : showOverdueBadge ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="pt-1">
                  {isReturned ? (
                    showRedReturnedBadge ? (
                      <ReturnBookDialog
                        loan={loan}
                        readOnly
                        triggerLabel="Returned"
                        onSuccess={handleReturnSuccess}
                      />
                    ) : (
                      <Badge variant="success">Returned</Badge>
                    )
                  ) : (
                    <ReturnBookDialog loan={loan} onSuccess={handleReturnSuccess} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Layout */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Book
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  ISBN
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Condition
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Deadline
                </th>
                <th className="px-4 py-4 text-right text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const isReturned = loan.status === BookLoanStatus.RETURNED;
                const showOverdueBadge = !isReturned && isOverdue(loan.returnDeadline);
                const showRedReturnedBadge =
                  isReturned && isSevereReturnCondition(loan);

                return (
                  <tr key={loan.id} className="border-b border-border">
                    <td className="px-4 py-4">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded">
                          <img
                            src={`${BASE_API}/${loan.bookInventory?.book?.coverUrl}`}
                            alt={loan.bookInventory?.book?.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <Link
                            href={`/books/${loan.bookInventory?.book?.id}`}
                            className="font-semibold hover:underline"
                          >
                            {loan.bookInventory?.book?.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-muted-foreground">
                      {loan.bookInventory?.book?.isbn}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary">
                        {formatCondition(loan.checkoutCondition)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {formatDate(loan.returnDeadline)}
                        {isReturned ? (
                          showRedReturnedBadge ? (
                            <Badge variant="destructive">Returned</Badge>
                          ) : (
                            <Badge variant="success">Returned</Badge>
                          )
                        ) : showOverdueBadge ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {isReturned ? (
                        showRedReturnedBadge ? (
                          <ReturnBookDialog
                            loan={loan}
                            readOnly
                            triggerLabel="Returned"
                            onSuccess={handleReturnSuccess}
                          />
                        ) : (
                          <Badge variant="success">Returned</Badge>
                        )
                      ) : (
                        <ReturnBookDialog loan={loan} onSuccess={handleReturnSuccess} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
