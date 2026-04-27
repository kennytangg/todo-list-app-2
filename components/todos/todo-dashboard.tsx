"use client";

import { useMemo, useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import { useTodoStore } from "@/hooks/use-todo-store";
import { TodoList } from "./todo-list";
import { TodoForm } from "./todo-form";
import { TodoFilters } from "./todo-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TodoDashboard() {
  const { data: todos = [], isLoading, isError } = useTodos();
  const { filter, search } = useTodoStore();
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !t.completed) ||
        (filter === "completed" && t.completed);
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Todos</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Todo
        </Button>
      </div>

      <TodoFilters totalCount={todos.length} />

      <TodoList todos={filtered} isLoading={isLoading} isError={isError} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Todo</DialogTitle>
          </DialogHeader>
          <TodoForm onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
