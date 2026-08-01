"use client";

import { UseFormReturn, FieldPath } from "react-hook-form";
import { PriceCalculatorInput } from "@/types/pricecalculator";

interface Props {
  form: UseFormReturn<PriceCalculatorInput>;
  name: FieldPath<PriceCalculatorInput>;
  label: string;
  placeholder?: string;
}

export default function InputField({ form, name, label, placeholder }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        type="number"
        placeholder={placeholder}
        {...form.register(name, {
          valueAsNumber: true,
        })}
        className="w-full rounded-2xl border border-default bg-background px-4 py-3 outline-none transition focus:border-brand"
      />
    </div>
  );
}
