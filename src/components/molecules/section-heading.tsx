type SectionHeadingProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  id?: string;
};

export function SectionHeading({ title, description, eyebrow, id }: SectionHeadingProps) {
  return (
    <>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-heading" id={id}>{title}</h2>
      {description && <p className="section-lead">{description}</p>}
    </>
  );
}
