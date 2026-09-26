export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  system: string;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="testimonial-card">
      <blockquote>{testimonial.quote}</blockquote>
      <figcaption>
        <strong>{testimonial.name}</strong>
        <span>{testimonial.role} · {testimonial.location}</span>
        <span>{testimonial.system}</span>
      </figcaption>
    </figure>
  );
}
