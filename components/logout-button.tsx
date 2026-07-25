"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth");
    router.refresh();
  }
  return <button type="button" onClick={logout} className="rounded-lg border border-[#cfd7cf] px-3 py-2 text-sm font-semibold text-[#344238] transition hover:bg-white">Sign out</button>;
}
