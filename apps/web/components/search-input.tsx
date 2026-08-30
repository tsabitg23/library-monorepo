"use client";

import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useState } from "react";

export function SearchInput() {
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const searchOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "isbn", label: "ISBN" },
    { value: "tags", label: "Tags" },
  ];

  return (
    <div className="flex gap-2 w-full">
      <Select value={searchType} onValueChange={setSearchType}>
        <SelectTrigger className="w-[120px]">
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
        onChange={(e) => setSearchValue(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
