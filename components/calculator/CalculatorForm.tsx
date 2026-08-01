"use client";

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PriceCalculatorInput, Platform } from "@/types/pricecalculator";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "meesho", label: "Meesho" },
  { id: "amazon", label: "Amazon" },
  { id: "flipkart", label: "Flipkart" },
];

export default function CalculatorForm({
  form,
}: {
  form: UseFormReturn<PriceCalculatorInput>;
}) {
  const { register, watch, setValue } = form;
  const platform = watch("platform");

  return (
    <div className="rounded-2xl border border-[#e7e7e5] bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-[#172118]">Calculator</h2>

      <div className="mb-6">
        <Label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#8a938b]">
          Platform
        </Label>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setValue("platform", p.id, { shouldDirty: true })}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                platform === p.id
                  ? "border-[#f04923] bg-[#fff3ef] text-[#f04923]"
                  : "border-[#e7e7e5] text-[#5b645c] hover:border-[#c9d0ca]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          id="productCost"
          label="Product Cost (Without GST)"
          prefix="₹"
          register={register}
        />
        <NumberField
          id="gstRate"
          label="GST Rate"
          suffix="%"
          register={register}
        />
        <NumberField
          id="desiredProfit"
          label="Desired Profit"
          prefix="₹"
          register={register}
        />
        <NumberField
          id="shippingCost"
          label="Shipping Cost"
          prefix="₹"
          register={register}
        />
        <NumberField
          id="returnRate"
          label="Customer Return Rate"
          suffix="%"
          register={register}
        />
        <NumberField
          id="damagedRate"
          label="Damaged Rate"
          suffix="%"
          register={register}
        />
        <NumberField
          id="adSpend"
          label="Ad Spend"
          prefix="₹"
          register={register}
        />
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  prefix,
  suffix,
  register,
}: {
  id: keyof PriceCalculatorInput;
  label: string;
  prefix?: string;
  suffix?: string;
  register: UseFormReturn<PriceCalculatorInput>["register"];
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="mb-2 block text-xs font-medium text-[#5b645c]"
      >
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8a938b]">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          step="any"
          className={prefix ? "pl-7" : suffix ? "pr-8" : ""}
          {...register(id, { valueAsNumber: true })}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#8a938b]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
