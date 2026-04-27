import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createTodoSchema } from "@/lib/validations";
import { ok, fail } from "@/lib/api";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return fail("Unauthorized", 401);

  const rows = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(desc(todos.createdAt));

  return ok(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return fail("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  const parsed = createTodoSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0].message, 422);
  }

  const { title, description, dueDate } = parsed.data;

  const [todo] = await db
    .insert(todos)
    .values({
      userId: session.user.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning();

  return ok(todo, 201);
}
