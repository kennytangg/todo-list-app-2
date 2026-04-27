"use client";

import { useState } from "react";
import type { Todo } from "@/lib/db/schema";
import { useCreateTodo, useUpdateTodo } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TodoFormProps {
  todo?: Todo;
  onSuccess?: () => void;
}

export function TodoForm({ todo, onSuccess }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [dueDate, setDueDate] = useState(
    todo?.dueDate
      ? new Date(todo.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [error, setError] = useState("");

  const create = useCreateTodo();
  const update = useUpdateTodo();
  const isPending = create.isPending || update.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const dueDateISO = dueDate
      ? new Date(dueDate + "T23:59:59").toISOString()
      : null;

    try {
      if (todo) {
        await update.mutateAsync({
          id: todo.id,
          title,
          description: description || null,
          dueDate: dueDateISO,
        });
        toast.success("Todo updated");
      } else {
        await create.mutateAsync({
          title,
          description: description || undefined,
          dueDate: dueDateISO,
        });
        toast.success("Todo created");
      }
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {todo ? "Save changes" : "Create todo"}
        </Button>
      </div>
    </form>
  );
}
