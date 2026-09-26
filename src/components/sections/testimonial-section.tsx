import { TestimonialCard, type Testimonial } from "@/components/molecules/testimonial-card";
import { SectionHeading } from "@/components/molecules/section-heading";

export function TestimonialSection({ title, description, testimonials }: { title: string; description: string; testimonials: readonly Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="section testimonial-section">
      <div className="container">
        <SectionHeading title={title} description={description} />
        <div className="testimonial-grid">{testimonials.map((testimonial) => <TestimonialCard key={`${testimonial.name}-${testimonial.system}`} testimonial={testimonial} />)}</div>
      </div>
    </section>
  );
}
