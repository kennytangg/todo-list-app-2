import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { updateTodoSchema } from "@/lib/validations";
import { ok, fail } from "@/lib/api";
import { headers } from "next/headers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return fail("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateTodoSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0].message, 422);
  }

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
    .limit(1);

  if (!existing.length) return fail("Not found", 404);

  const { title, description, completed, dueDate } = parsed.data;

  const updates: Partial<typeof todos.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (completed !== undefined) updates.completed = completed;
  if (dueDate !== undefined)
    updates.dueDate = dueDate ? new Date(dueDate) : null;

  const [updated] = await db
    .update(todos)
    .set(updates)
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
    .returning();

  return ok(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return fail("Unauthorized", 401);

  const { id } = await params;

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
    .limit(1);

  if (!existing.length) return fail("Not found", 404);

  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)));

  return ok(null);
}
