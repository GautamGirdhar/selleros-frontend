"use client";

import { Bell } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { UserDropdown } from "./UserDropdown";

export default function Navbar() {
  const { user, isLoading, error } = useUser();

  console.log({
    user,
    isLoading,
    error,
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-8">
      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          seller
          <span className="text-green-600">os</span>
        </h1>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        <button className="rounded-lg p-2 transition hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>

        {!isLoading && user && <UserDropdown user={user} />}
      </div>
    </header>
  );
}
