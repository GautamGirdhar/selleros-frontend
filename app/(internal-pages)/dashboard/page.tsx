"use client";

import { useUser } from "@/hooks/useUser";

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-destructive">Unauthorized</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 sm:px-12">
      <section className="mx-auto max-w-6xl pt-20">
        <p className="text-sm font-semibold text-primary">YOUR WORKSPACE</p>

        <h1 className="mt-3 text-4xl font-semibold text-foreground">
          Welcome back, {user.full_name.split(" ")[0]}.
        </h1>

        <p className="mt-4 text-muted-foreground">
          You&apos;re signed in as {user.email}.
        </p>
      </section>
    </main>
  );
}
