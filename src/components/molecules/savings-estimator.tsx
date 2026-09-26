"use client";

import { useState } from "react";
import { ActionLink } from "@/components/atoms/action-link";
import { RangeInput } from "@/components/atoms/range-input";

const currency = new Intl.NumberFormat("vi-VN");
const formatBill = (value: number) => `${currency.format(value)} đ`;

type SavingsEstimatorProps = {
  minBill: number;
  maxBill: number;
  step: number;
  initialBill: number;
  savingsRate: number;
  capacityPerMillion: number;
  title: string;
  billLabel: string;
  savingsLabel: string;
  capacityLabel: string;
  disclaimer: string;
  actionLabel: string;
  actionHref: string;
};

export function SavingsEstimator({ minBill, maxBill, step, initialBill, savingsRate, capacityPerMillion, title, billLabel, savingsLabel, capacityLabel, disclaimer, actionLabel, actionHref }: SavingsEstimatorProps) {
  const [bill, setBill] = useState(initialBill);
  const savings = Math.round(bill * savingsRate);
  const capacity = (bill / 1_000_000 * capacityPerMillion).toFixed(1);

  return (
    <div className="calculator-card">
      <div className="calculator-heading">
        <h2>{title}</h2>
        <span className="calculator-icon" aria-hidden="true">ϟ</span>
      </div>
      <RangeInput id="monthly-bill" label={billLabel} value={bill} min={minBill} max={maxBill} step={step} onChange={setBill} formatValue={formatBill} />
      <div className="calculator-result" aria-live="polite">
        <span>{savingsLabel}</span>
        <strong>{formatBill(savings)}</strong>
        <span>{capacityLabel}: {capacity} kWp</span>
      </div>
      <p className="calculator-disclaimer">{disclaimer}</p>
      <ActionLink href={actionHref} variant="primary">{actionLabel}</ActionLink>
    </div>
  );
}
