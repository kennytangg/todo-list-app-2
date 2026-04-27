"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut } from "lucide-react";

interface DashboardNavProps {
  user: { name: string; email: string };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <CheckSquare className="h-5 w-5" />
          Todos
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500 hidden sm:block">
            {user.name || user.email}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
