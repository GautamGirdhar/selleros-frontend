"use client";

import { useForm, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { calculatePricing } from "@/services/pricecalService";
import { PriceCalculatorInput } from "@/types/pricecalculator";

import CalculatorForm from "./CalculatorForm";
import ResultCard from "./ResultCard";
import BreakdownTable from "./BreakdownTable";

export default function PriceCalculator() {
  const form = useForm<PriceCalculatorInput>({
    defaultValues: {
      platform: "meesho",
      productCost: 220,
      gstRate: 5,
      desiredProfit: 48,
      returnRate: 25,
      damagedRate: 2,
      shippingCost: 70,
      adSpend: 0,
    },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const [debounced] = useDebounce(watchedValues, 400);

  const mutation = useMutation({
    mutationFn: calculatePricing,
  });

  useEffect(() => {
    mutation.mutate(form.getValues());
  }, [debounced]);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <CalculatorForm form={form} />
      </div>

      <div className="flex flex-col gap-6 lg:col-span-3">
        <ResultCard data={mutation.data} loading={mutation.isPending} />
        <BreakdownTable data={mutation.data} />
      </div>
    </div>
  );
}
