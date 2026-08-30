"use client";

import { useAuthStore } from "@/lib/auth";
import {
  BookCondition,
  BookLoan,
  BookLoanStatus,
  isSevereReturnCondition,
  returnBooks,
} from "@/lib/borrows";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Label } from "@repo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { toast } from "@repo/ui/sonner";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type ReturnBookFormValues = {
  returnCondition: BookCondition;
  notes?: string;
};

function getDefaultStatus(loan: BookLoan) {
  if (loan.status === BookLoanStatus.OVERDUE) {
    return BookLoanStatus.OVERDUE;
  }

  if (loan.returnDeadline && new Date(loan.returnDeadline).getTime() < Date.now()) {
    return BookLoanStatus.OVERDUE;
  }

  return BookLoanStatus.RETURNED;
}

const conditionOptions = Object.values(BookCondition);

export function ReturnBookDialog({
  loan,
  onSuccess,
  readOnly = false,
  triggerLabel = "Return",
}: {
  loan: BookLoan;
  onSuccess?: (updatedLoan: BookLoan) => void;
  readOnly?: boolean;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const defaultValues = useMemo<ReturnBookFormValues>(
    () => ({
      returnCondition: loan.returnCondition ?? loan.checkoutCondition,
      notes: loan.notes ?? "",
    }),
    [loan],
  );

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReturnBookFormValues>({
    defaultValues,
  });

  const currentStatus = getDefaultStatus(loan);
  const isSevereReturn = isSevereReturnCondition(loan);
  const isReadOnly = readOnly || isSevereReturn;

  const returnMutation = useMutation({
    mutationFn: async (values: ReturnBookFormValues) => {
      if (!accessToken) {
        throw new Error("Please log in to return a book.");
      }

      const bookId = loan.bookInventory?.book?.id;
      if (!bookId) {
        throw new Error("Unable to identify the book for return.");
      }

      const returnedLoans = await returnBooks(accessToken, [
        {
          bookId,
          returnCondition: values.returnCondition,
          notes: values.notes?.trim() || null,
        },
      ]);

      const updatedLoan = returnedLoans[0];
      if (!updatedLoan) {
        throw new Error("Return response did not include the updated loan.");
      }

      return updatedLoan;
    },
    onSuccess: (updatedLoan) => {
      toast.success(
        currentStatus === BookLoanStatus.OVERDUE
          ? "Loan marked as overdue on return."
          : "Loan marked as returned.",
      );
      reset({
        returnCondition: updatedLoan.returnCondition ?? loan.returnCondition ?? loan.checkoutCondition,
        notes: updatedLoan.notes ?? "",
      });
      setOpen(false);
      onSuccess?.(updatedLoan);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to return the book.",
      );
    },
  });

  const onSubmit = (values: ReturnBookFormValues) => {
    returnMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isReadOnly ? (
          <Badge variant="destructive" className="cursor-pointer">
            {triggerLabel}
          </Badge>
        ) : (
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Return book</DialogTitle>
          <DialogDescription>
            Record the final condition and any notes for this loan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isReadOnly && (
            <div className="space-y-2">
              <Label>Checkout condition</Label>
              <Input
                value={loan.checkoutCondition.charAt(0).toUpperCase() + loan.checkoutCondition.slice(1)}
                readOnly
                className="bg-muted/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Book condition</Label>
            <Select
              value={watch("returnCondition")}
              onValueChange={(value) => setValue("returnCondition", value as BookCondition, { shouldDirty: true })}
              disabled={isReadOnly}
            >
              <SelectTrigger aria-label="Return book condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.returnCondition && (
              <p className="text-sm text-destructive">Please choose a return condition.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="return-notes">Notes</Label>
            <Textarea
              id="return-notes"
              placeholder="Optional notes about the returned book"
              {...register("notes")}
              disabled={isReadOnly}
            />
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={returnMutation.isPending}>
                {returnMutation.isPending
                  ? "Processing..."
                  : currentStatus === BookLoanStatus.OVERDUE
                    ? "Mark overdue"
                    : "Confirm return"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
