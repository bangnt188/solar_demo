type ProcessStepProps = { number: string; title: string; description: string };

export function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <li className="process-card">
      <span className="process-number">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
