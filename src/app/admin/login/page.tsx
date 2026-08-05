"use client";

import { Suspense } from "react";
import AdminLoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-primary text-silver">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
