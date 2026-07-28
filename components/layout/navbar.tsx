"use client";

import { Bell } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const { user, isLoading, error } = useUser();

  console.log({
    user,
    isLoading,
    error,
  });

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        justify-between
        border-b
        border-border
        bg-surface
        px-8
      "
    >
      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          seller
          <span className="text-primary">os</span>
        </h1>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button
          className="
            rounded-xl
            border
            border-border
            bg-card
            p-2
            text-muted-foreground
            transition-all
            hover:bg-muted
            hover:text-foreground
          "
        >
          <Bell className="h-5 w-5" />
        </button>

        {!isLoading && user && <UserDropdown user={user} />}
      </div>
    </header>
  );
}
