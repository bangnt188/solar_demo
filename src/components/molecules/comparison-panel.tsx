type ComparisonPanelProps = {
  label: string;
  title: string;
  description: string;
  tone: "before" | "after";
};

export function ComparisonPanel({ label, title, description, tone }: ComparisonPanelProps) {
  return (
    <article className={`comparison-card comparison-${tone}`}>
      <span className="comparison-label">{label}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
