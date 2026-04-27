import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardNav } from "@/components/todos/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardNav user={session.user} />
      <main className="container mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
