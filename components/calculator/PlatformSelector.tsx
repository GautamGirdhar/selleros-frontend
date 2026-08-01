"use client";

import { UseFormReturn } from "react-hook-form";
import { PriceCalculatorInput } from "@/types/pricecalculator";

interface Props {
  form: UseFormReturn<PriceCalculatorInput>;
}

const platforms = ["meesho", "amazon", "flipkart"] as const;

export default function PlatformSelector({ form }: Props) {
  const current = form.watch("platform");

  return (
    <div>
      <label className="mb-3 block font-medium">Marketplace</label>

      <div className="grid grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            onClick={() => form.setValue("platform", platform)}
            className={`rounded-2xl border p-4 transition

              ${
                current === platform
                  ? "border-brand bg-brand text-white"
                  : "border-default bg-card hover:border-brand"
              }
            `}
          >
            {platform.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
