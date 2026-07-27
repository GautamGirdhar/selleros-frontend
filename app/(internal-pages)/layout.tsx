"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

import { useUser } from "@/hooks/useUser";
import { clearTokens, getAccessToken } from "@/lib/token";

interface Props {
  children: ReactNode;
}

export default function InternalLayout({ children }: Props) {
  const router = useRouter();

  const token = getAccessToken();

  const { user, isLoading, error } = useUser();

  useEffect(() => {
    if (!token) {
      router.replace("/auth");
    }
  }, [token, router]);

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      clearTokens();
      router.replace("/auth");
    }
  }, [user, error, isLoading, router]);

  if (!token || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
