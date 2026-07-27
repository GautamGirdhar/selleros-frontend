"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";

export function useUser() {
  const query = useQuery({
    queryKey: ["current-user"],

    queryFn: authService.getMe,

    retry: false,

    staleTime: 1000 * 60 * 5,
  });

  return {
    user: query.data,

    isLoading: query.isPending,

    error: query.error,

    refetch: query.refetch,
  };
}
