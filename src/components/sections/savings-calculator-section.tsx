import type { ReactNode } from "react";

export function SavingsCalculatorSection({ children }: { children: ReactNode }) {
  return <section className="calculator-section" aria-label="Công cụ ước tính tiền điện">{children}</section>;
}
