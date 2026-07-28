"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
    },
    {
      name: "Dark",
      value: "dark",
      icon: Moon,
    },
    {
      name: "System",
      value: "system",
      icon: Monitor,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
          h-10
          w-10
          rounded-xl
          border
          border-default
          bg-surface
          shadow-sm
          hover:bg-surface-hover
          "
        >
          <Sun
            className="
            h-5
            w-5
            transition-all
            dark:rotate-90
            dark:scale-0
            "
          />

          <Moon
            className="
            absolute
            h-5
            w-5
            scale-0
            transition-all
            dark:scale-100
            "
          />

          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
        w-52
        rounded-2xl
        border
        border-default
        bg-surface
        p-2
        shadow-xl
        "
      >
        {themes.map((item) => {
          const Icon = item.icon;
          const active = theme === item.value;

          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setTheme(item.value)}
              className={`
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              transition-all

              ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-surface-hover"
              }
              `}
            >
              <Icon
                className="
                h-4
                w-4
                "
              />

              <span className="flex-1">{item.name}</span>

              {active && (
                <Check
                  className="
                  h-4
                  w-4
                  text-primary
                  "
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
