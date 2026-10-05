import { ContactSection } from "@/components/sections/contact-section";
import { EquipmentOfferSection } from "@/components/sections/equipment-offer-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SolutionsSection } from "@/components/sections/solutions-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import type { LandingView, RenderedSection } from "@/types/landing";

function SectionRenderer({ section, landing }: { section: RenderedSection; landing: LandingView }) {
  switch (section.key) {
    case "hero": return <HeroSection content={section.content} />;
    case "partners": return <PartnersSection content={section.content} />;
    case "solutions": return <SolutionsSection content={section.content} />;
    case "services": return <ServicesSection content={section.content} />;
    case "whyUs": return <WhyUsSection content={section.content} />;
    case "featuredProjects": return <FeaturedProjectsSection content={{ ...section.content, projectTitles: section.content.projectTitles ?? landing.projects.map(project => project.title) }} projects={landing.projects} />;
    case "testimonials": return section.content.items.length > 0 ? <TestimonialSection title={section.content.title} description={section.content.description} testimonials={section.content.items} /> : null;
    case "equipmentOffer": return <EquipmentOfferSection content={section.content} equipment={landing.equipment} />;
    case "faq": return <FaqSection content={section.content} />;
    case "contact": return <ContactSection content={section.content} />;
    default: {
      const unreachable: never = section;
      return unreachable;
    }
  }
}

export function HomeScreen({ landing }: { landing: LandingView }) {
  // The repository projects enabled sections only; render their published order.
  return <>{[...landing.sections].sort((a, b) => a.position - b.position).map(section => <SectionRenderer key={section.key} section={section} landing={landing} />)}</>;
}
