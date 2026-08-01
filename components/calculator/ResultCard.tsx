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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-shadow">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        List your price at
      </p>
      <p className="mt-1 text-5xl font-bold text-secondary">
        {loading || !data ? "…" : `₹${data.listingPrice.toFixed(2)}`}
      </p>
      {data && (
        <p className="mt-1 text-xs text-muted-foreground">
          Including GST · Break-even ₹
          {(data.listingPrice - data.profit).toFixed(2)}
        </p>
      )}

      <div className="my-6 border-t border-border" />

      <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
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
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ProportionBar({ data }: { data: PriceCalculatorResult }) {
  const segments = [
    {
      label: "Cost",
      value: data.totalCost - data.platformFee,
      color: "var(--info)",
    },
    { label: "Platform fee", value: data.platformFee, color: "var(--warning)" },
    { label: "Damage", value: data.damagedCost, color: "var(--danger)" },
    { label: "Profit", value: data.profit, color: "var(--success)" },
    { label: "GST", value: data.gst, color: "var(--foreground-muted)" },
  ];
  const total = segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0) || 1;

  return (
    <div className="mt-6">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
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
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground-secondary">
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
