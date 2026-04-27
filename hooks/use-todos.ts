"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "@/lib/db/schema";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchJSON<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed");
  return json;
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchJSON<Todo[]>("/api/todos").then((r) => r.data ?? []),
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; dueDate?: string | null }) =>
      fetchJSON<Todo>("/api/todos", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.data!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      description?: string | null;
      completed?: boolean;
      dueDate?: string | null;
    }) =>
      fetchJSON<Todo>(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.data!),
    onMutate: async ({ id, dueDate, ...data }) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const prev = qc.getQueryData<Todo[]>(["todos"]);
      qc.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) =>
          t.id === id
            ? {
                ...t,
                ...data,
                dueDate:
                  dueDate !== undefined
                    ? dueDate
                      ? new Date(dueDate)
                      : null
                    : t.dueDate,
              }
            : t
        ) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["todos"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJSON(`/api/todos/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const prev = qc.getQueryData<Todo[]>(["todos"]);
      qc.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((t) => t.id !== id) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["todos"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
}
