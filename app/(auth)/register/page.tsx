import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export const metadata = { title: "Register — Todos" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-neutral-500">Get started for free</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
}
