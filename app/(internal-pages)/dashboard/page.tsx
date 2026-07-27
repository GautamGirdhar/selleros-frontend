"use client";

import { useUser } from "@/hooks/useUser";

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-8 sm:px-12">
      <section className="mx-auto max-w-6xl pt-20">
        <p className="text-sm font-semibold text-[#4f8a60]">YOUR WORKSPACE</p>

        <h1 className="mt-3 text-4xl font-semibold">
          Welcome back, {user.full_name.split(" ")[0]}.
        </h1>

        <p className="mt-4 text-[#69736b]">
          You&apos;re signed in as {user.email}.
        </p>
      </section>
    </main>
  );
}
