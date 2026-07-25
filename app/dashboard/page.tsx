import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

type User = { full_name: string; email: string };

export default async function DashboardPage() {
  const cookieStore = await cookies();
  console.log(cookieStore.get("selleros_user"));
  const rawUser = cookieStore.get("selleros_user")?.value;
  if (!rawUser) redirect("/auth");

  let user: User;
  try {
    user = JSON.parse(rawUser) as User;
  } catch {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-8 sm:px-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#dbe1da] pb-6">
        <span className="text-xl font-bold tracking-tight">
          seller<span className="text-[#4f8a60]">os</span>
        </span>
        <LogoutButton />
      </header>
      <section className="mx-auto max-w-6xl pt-20">
        <p className="text-sm font-semibold text-[#4f8a60]">YOUR WORKSPACE</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Welcome back, {user.full_name.split(" ")[0]}.
        </h1>
        <p className="mt-4 text-[#69736b]">
          You&apos;re signed in as {user.email}. Your SellerOS dashboard is
          ready for the next module.
        </p>
      </section>
    </main>
  );
}
