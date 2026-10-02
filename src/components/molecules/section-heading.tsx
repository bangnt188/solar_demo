import { SectionHeading as UiSectionHeading, type SectionHeadingProps as UiSectionHeadingProps } from "@solar/ui";
import styles from "./section-heading.module.css";

type SectionHeadingProps = Pick<UiSectionHeadingProps, "title" | "description" | "eyebrow" | "id">;

export function SectionHeading({ title, description, eyebrow, id }: SectionHeadingProps) {
  return (
    <UiSectionHeading title={title} description={description} eyebrow={eyebrow} id={id}
      headingClassName={`section-heading ${styles.heading}`}
      descriptionClassName={`section-lead ${styles.description}`}
      eyebrowClassName="eyebrow"
    />
  );
}
