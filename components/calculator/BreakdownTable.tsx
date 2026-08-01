"use client";

import { PriceCalculatorResult } from "@/types/pricecalculator";

export default function BreakdownTable({
  data,
}: {
  data?: PriceCalculatorResult;
}) {
  if (!data) return null;

  const preGstPrice = data.listingPrice - data.gst;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Panel title="Costs">
        <Row label="Product cost" value={data.productCost} />
        <Row label="Shipping cost" value={data.shippingCost} />
        <Row label="Return cost" value={data.returnCost} />
        <Row label="Damaged loss" value={data.damagedCost} />
        <Row label="Ad spend" value={data.adSpend} />
        <Row label="Total cost" value={data.totalCost} bold />
      </Panel>

      <Panel title="Price Calculation">
        <Row label="Total cost" value={data.totalCost} />
        <Row label="+ Platform fee" value={data.platformFee} />
        <Row label="+ Profit" value={data.profit} />
        <Row label="Pre-tax revenue" value={preGstPrice} />
        <Row label="+ GST" value={data.gst} />
        <Row label="Listing price" value={data.listingPrice} bold />
      </Panel>

      <Panel title="GST Summary">
        <Row label="Output GST (from buyer)" value={data.gst} />
        <Row label="Input GST (on purchases)" value={0} />
        <Row label="Net GST payable" value={data.gst} bold />
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e7e5] bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a938b]">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between text-sm ${
        bold
          ? "border-t border-[#e7e7e5] pt-2 font-semibold text-[#172118]"
          : "text-[#5b645c]"
      }`}
    >
      <span>{label}</span>
      <span>₹{value.toFixed(2)}</span>
    </div>
  );
}
