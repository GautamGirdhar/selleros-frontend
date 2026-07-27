"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Images",
    href: "/ai-images",
    icon: ImageIcon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo */}

      <div className="flex h-18 items-center justify-between border-b px-6">
        <Link
          href="/dashboard"
          className={cn(
            "font-bold tracking-tight",
            collapsed ? "text-xl" : "text-2xl",
          )}
        >
          {!collapsed && (
            <>
              seller<span className="text-[#4f8a60]">os</span>
            </>
          )}

          {collapsed && <span className="text-[#4f8a60] font-black">S</span>}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-6 rounded-full border bg-white p-1 shadow"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-[#1e4d32] text-white shadow"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}

      {!collapsed && (
        <div className="border-t p-5">
          <div className="rounded-xl bg-[#f6f8f6] p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Free Plan
            </p>

            <h3 className="mt-1 font-semibold">10 Credits Remaining</h3>

            <p className="mt-2 text-sm text-gray-500">
              Upgrade anytime for unlimited AI generations.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
