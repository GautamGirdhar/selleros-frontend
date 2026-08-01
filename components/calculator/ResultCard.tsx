"use client";

import { PriceCalculatorResult } from "@/types/pricecalculator";

export default function ResultCard({
  data,
  loading,
}: {
  data?: PriceCalculatorResult;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e7e5] bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-[#8a938b]">
        List your price at
      </p>
      <p className="mt-1 text-4xl font-bold text-[#f04923]">
        {loading || !data ? "…" : `₹${data.listingPrice.toFixed(2)}`}
      </p>
      {data && (
        <p className="mt-1 text-xs text-[#8a938b]">
          Including GST · Break-even ₹
          {(data.listingPrice - data.profit).toFixed(2)}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat
          label="Margin"
          value={data ? `${data.margin.toFixed(1)}%` : "—"}
        />
        <Stat label="ROI" value={data ? `${data.roi.toFixed(1)}%` : "—"} />
        <Stat
          label="Profit / unit"
          value={data ? `₹${data.profit.toFixed(2)}` : "—"}
        />
      </div>

      {data && <ProportionBar data={data} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#8a938b]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#172118]">{value}</p>
    </div>
  );
}

function ProportionBar({ data }: { data: PriceCalculatorResult }) {
  const segments = [
    {
      label: "Cost",
      value: data.totalCost - data.platformFee,
      color: "#3b82f6",
    },
    { label: "Platform fee", value: data.platformFee, color: "#f59e0b" },
    { label: "Damage", value: data.damagedCost, color: "#94a3b8" },
    { label: "Profit", value: data.profit, color: "#22c55e" },
    { label: "GST", value: data.gst, color: "#a78bfa" },
  ];
  const total = segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0) || 1;

  return (
    <div className="mt-6">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(Math.max(s.value, 0) / total) * 100}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5b645c]">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} ₹{s.value.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
