export type Platform = "meesho" | "amazon" | "flipkart";

export interface PriceCalculatorInput {
  platform: Platform;
  productCost: number;
  gstRate: number;
  desiredProfit: number;
  returnRate: number;
  damagedRate: number;
  shippingCost: number;
  adSpend: number;
}

export interface PriceCalculatorResult {
  listingPrice: number;
  totalCost: number;
  profit: number;
  margin: number;
  roi: number;
  gst: number;
  productCost: number;
  shippingCost: number;
  platformFee: number;
  returnCost: number;
  damagedCost: number;
  adSpend: number;
}
