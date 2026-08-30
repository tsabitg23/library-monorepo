"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const searchOptions = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "isbn", label: "ISBN" },
  { value: "tags", label: "Tags" },
] as const;

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState<(typeof searchOptions)[number]["value"]>("title");
  const [searchValue, setSearchValue] = useState("");

  const activeSearchType = useMemo(
    () =>
      searchOptions.find(
        (option) => (searchParams.get(option.value) ?? "").trim().length > 0,
      )?.value ?? "title",
    [searchParams],
  );

  useEffect(() => {
    setSearchType(activeSearchType);
    setSearchValue(searchParams.get(activeSearchType) ?? "");
  }, [activeSearchType, searchParams]);

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    const params = new URLSearchParams();

    for (const option of searchOptions) {
      params.delete(option.value);
    }

    if (trimmedValue) {
      params.set(searchType, trimmedValue);
    }

    params.set("page", "1");
    params.set("pageSize", searchParams.get("pageSize") ?? "8");

    router.push(`/book_search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
    >
      <Select value={searchType} onValueChange={(value) => setSearchType(value as typeof searchType)}>
        <SelectTrigger className="w-[120px]" aria-label="Search filter type">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {searchOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        className="flex-1"
        aria-label="Search books"
      />

      <Button
        type="submit"
        variant="default"
        size="icon"
        className="shrink-0"
        aria-label={`Search books by ${searchOptions.find((option) => option.value === searchType)?.label ?? "title"}`}
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
