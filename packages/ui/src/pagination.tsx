import * as React from "react"

import { cn } from "./utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-row items-center gap-2", className)} {...props} />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={className} {...props} />
}

export { Pagination, PaginationContent, PaginationItem }