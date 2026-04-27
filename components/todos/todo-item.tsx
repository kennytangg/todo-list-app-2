"use client";

import { useState } from "react";
import type { Todo } from "@/lib/db/schema";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { useTodoStore } from "@/hooks/use-todo-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TodoForm } from "./todo-form";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { editingId, setEditingId } = useTodoStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const update = useUpdateTodo();
  const remove = useDeleteTodo();

  const isEditing = editingId === todo.id;
  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  async function handleToggle() {
    await update.mutateAsync({ id: todo.id, completed: !todo.completed });
  }

  async function handleDelete() {
    await remove.mutateAsync(todo.id);
    toast.success("Todo deleted");
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-white p-4 shadow-xs transition-colors",
        todo.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="mt-0.5 shrink-0"
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium leading-snug truncate",
            todo.completed && "line-through text-neutral-400"
          )}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-0.5 text-sm text-neutral-500 line-clamp-2">
            {todo.description}
          </p>
        )}
        {todo.dueDate && (
          <div
            className={cn(
              "mt-1.5 flex items-center gap-1 text-xs",
              isOverdue ? "text-red-500" : "text-neutral-400"
            )}
          >
            <CalendarDays className="h-3 w-3" />
            {new Date(todo.dueDate).toLocaleDateString()}
            {isOverdue && <Badge variant="destructive" className="text-[10px] py-0 px-1">Overdue</Badge>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setEditingId(todo.id)}
          aria-label="Edit todo"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => setDeleteConfirm(true)}
          aria-label="Delete todo"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={isEditing} onOpenChange={(o) => !o && setEditingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <TodoForm
            todo={todo}
            onSuccess={() => setEditingId(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete todo?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-500">
            &ldquo;{todo.title}&rdquo; will be permanently deleted.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
