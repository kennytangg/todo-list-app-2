import { createTodoSchema, updateTodoSchema } from "@/lib/validations";

describe("createTodoSchema", () => {
  it("accepts a valid todo", () => {
    const result = createTodoSchema.safeParse({ title: "Buy milk" });
    expect(result.success).toBe(true);
  });

  it("accepts optional description and dueDate", () => {
    const result = createTodoSchema.safeParse({
      title: "Buy milk",
      description: "Whole milk",
      dueDate: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createTodoSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Title is required");
  });

  it("rejects title over 255 chars", () => {
    const result = createTodoSchema.safeParse({ title: "a".repeat(256) });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = createTodoSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects description over 2000 chars", () => {
    const result = createTodoSchema.safeParse({
      title: "Test",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTodoSchema", () => {
  it("accepts partial update with completed flag", () => {
    const result = updateTodoSchema.safeParse({ completed: true });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateTodoSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects empty title string", () => {
    const result = updateTodoSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("accepts null dueDate to clear it", () => {
    const result = updateTodoSchema.safeParse({ dueDate: null });
    expect(result.success).toBe(true);
  });
});
