import type { ReactNode } from "react";

type FaqDisclosureProps = {
  number: string;
  question: string;
  children: ReactNode;
  initiallyOpen?: boolean;
};

export function FaqDisclosure({ number, question, children, initiallyOpen = false }: FaqDisclosureProps) {
  return (
    <details className="faq-item" open={initiallyOpen}>
      <summary><span aria-hidden="true">{number}</span>{question}</summary>
      <p className="faq-answer">{children}</p>
    </details>
  );
}
