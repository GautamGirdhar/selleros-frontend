import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[#d8ddd6] bg-white px-3.5 text-sm outline-none transition placeholder:text-[#8a938b] focus:border-[#1e4d32] focus:ring-4 focus:ring-[#1e4d32]/10",
        className,
      )}
      {...props}
    />
  );
}
