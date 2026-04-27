import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export const metadata = { title: "Login — Todos" };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-neutral-500">Sign in to your account</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-neutral-900 underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  );
}
