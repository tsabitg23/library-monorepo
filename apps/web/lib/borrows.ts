import { BASE_API } from "./utils";

export enum BookLoanStatus {
  ONGOING = "ongoing",
  RETURNED = "returned",
  OVERDUE = "overdue",
}

export enum BookCondition {
  NEW = "new",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
  LOST = "lost",
}

export function isSevereReturnCondition(
  loan: Pick<BookLoan, "checkoutCondition" | "returnCondition">,
): boolean {
  return (
    (loan.returnCondition === BookCondition.POOR ||
      loan.returnCondition === BookCondition.LOST) &&
    loan.checkoutCondition !== BookCondition.POOR
  );
}

export type BookLoan = {
  id: string;
  returnDate: string | null;
  returnDeadline: string;
  status: BookLoanStatus;
  checkoutCondition: BookCondition;
  returnCondition: BookCondition;
  notes?: string | null;
  bookInventory?: {
    book?: {
      id: string;
      title: string;
      isbn: string;
      coverUrl: string;
    };
  };
};

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.message === "string") {
      return body.message;
    }
    if (Array.isArray(body?.message)) {
      return body.message.join(", ");
    }
  } catch {
    // ignore body parsing errors and fall back to default message
  }
  return fallback;
}

export async function borrowBooks(
  accessToken: string,
  bookIds: string[],
): Promise<BookLoan[]> {
  const response = await fetch(`${BASE_API}/borrows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ bookIds }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to borrow the selected books."));
  }

  return response.json();
}

export async function fetchBorrowHistory(
  accessToken: string,
  search?: string,
): Promise<BookLoan[]> {
  const params = new URLSearchParams();
  if (search && search.trim().length > 0) {
    params.set("search", search.trim());
  }
  const query = params.toString();

  const response = await fetch(`${BASE_API}/borrows${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to load borrow history."));
  }

  return response.json();
}

export async function returnBooks(
  accessToken: string,
  returnItems: Array<{
    bookId: string;
    returnCondition: BookCondition;
    notes?: string | null;
  }>,
): Promise<BookLoan[]> {
  const response = await fetch(`${BASE_API}/return_books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(returnItems),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to return the selected books."));
  }

  return response.json();
}
