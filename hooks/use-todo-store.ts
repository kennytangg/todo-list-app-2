"use client";

import { create } from "zustand";

type Filter = "all" | "active" | "completed";

interface TodoStore {
  filter: Filter;
  search: string;
  editingId: string | null;
  setFilter: (f: Filter) => void;
  setSearch: (s: string) => void;
  setEditingId: (id: string | null) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  filter: "all",
  search: "",
  editingId: null,
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  setEditingId: (editingId) => set({ editingId }),
}));
