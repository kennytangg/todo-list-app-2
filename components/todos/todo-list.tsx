"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Todo } from "@/lib/db/schema";
import { TodoItem } from "./todo-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardList } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
}

export function TodoList({ todos, isLoading, isError }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load todos. Please refresh the page.</AlertDescription>
      </Alert>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400 gap-3">
        <ClipboardList className="h-10 w-10" />
        <p className="text-sm">No todos yet. Create one above!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            <TodoItem todo={todo} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
