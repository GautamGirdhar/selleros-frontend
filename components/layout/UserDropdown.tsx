"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  full_name: string;
  email: string;
  avatar: string | null;
}

interface Props {
  user: User;
}

export function UserDropdown({ user }: Props) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function logout() {
    await authService.logout();

    queryClient.clear();

    router.push("/auth");
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-border
          bg-card
          px-3
          py-1.5
          transition
          hover:bg-muted
        "
      >
        <Image
          src={
            user.avatar ?? `https://ui-avatars.com/api/?name=${user.full_name}`
          }
          alt={user.full_name}
          width={42}
          height={42}
          className="rounded-full"
        />

        <div className="hidden text-left lg:block">
          <p className="font-semibold text-foreground">{user.full_name}</p>

          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            shadow-xl
          "
        >
          <div className="border-b border-border p-5">
            <div className="flex gap-4">
              <Image
                src={
                  user.avatar ??
                  `https://ui-avatars.com/api/?name=${user.full_name}`
                }
                alt={user.full_name}
                width={50}
                height={50}
                className="rounded-full"
              />

              <div>
                <h3 className="font-semibold text-foreground">
                  {user.full_name}
                </h3>

                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              router.push("/settings");
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-5
              py-4
              text-left
              text-foreground
              transition
              hover:bg-muted
            "
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>

          <button
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              px-5
              py-4
              text-left
              text-destructive
              transition
              hover:bg-destructive/10
            "
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
