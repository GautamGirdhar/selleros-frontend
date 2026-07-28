"use client";

import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await authService.logout();
    router.push("/auth");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="
        rounded-xl
        border
        border-border
        bg-card
        px-4
        py-2
        text-sm
        font-semibold
        text-foreground
        shadow-sm
        transition-all
        hover:bg-muted
        hover:shadow-md
      "
    >
      Sign out
    </button>
  );
}
