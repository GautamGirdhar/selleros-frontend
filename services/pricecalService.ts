import api from "@/lib/api";

import {
  PriceCalculatorInput,
  PriceCalculatorResult,
} from "@/types/pricecalculator";

function toBackendPayload(data: PriceCalculatorInput) {
  return {
    platform: data.platform,
    product_cost: data.productCost,
    gst_rate: data.gstRate,
    desired_profit: data.desiredProfit,
    return_rate: data.returnRate,
    damage_rate: data.damagedRate,
    shipping_cost: data.shippingCost,
    ad_spend: data.adSpend,
  };
}

interface PricingApiResponse {
  listing_price: number;
  total_cost: number;
  profit: number;
  margin: number;
  roi: number;
  gst: number;
  product_cost: number;
  shipping_cost: number;
  platform_fee: number;
  return_cost: number;
  damaged_cost: number;
  ad_spend: number;
}

function fromBackendResponse(data: PricingApiResponse): PriceCalculatorResult {
  return {
    listingPrice: data.listing_price,
    totalCost: data.total_cost,
    profit: data.profit,
    margin: data.margin,
    roi: data.roi,
    gst: data.gst,
    productCost: data.product_cost,
    shippingCost: data.shipping_cost,
    platformFee: data.platform_fee,
    returnCost: data.return_cost,
    damagedCost: data.damaged_cost,
    adSpend: data.ad_spend,
  };
}

export async function calculatePricing(
  data: PriceCalculatorInput,
): Promise<PriceCalculatorResult> {
  const res = await api.post("/pricing/calculate", toBackendPayload(data));
  return fromBackendResponse(res.data);
}
