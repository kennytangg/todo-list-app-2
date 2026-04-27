"use client";

import { useTodoStore } from "@/hooks/use-todo-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TodoFiltersProps {
  totalCount: number;
}

export function TodoFilters({ totalCount }: TodoFiltersProps) {
  const { filter, search, setFilter, setSearch } = useTodoStore();

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
        <span className="ml-auto text-sm text-neutral-400">
          {totalCount} {totalCount === 1 ? "todo" : "todos"}
        </span>
      </div>
    </div>
  );
}
