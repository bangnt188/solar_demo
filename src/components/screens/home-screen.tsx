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
import type { HomeContent } from "@/types/home-content";
import type { Equipment, Project } from "@/types/catalog";

export function HomeScreen({ content, projects, equipment }: { content: HomeContent; projects: readonly Project[]; equipment: readonly Equipment[] }) {
  return (
    <>
      <HeroSection content={content.hero} />
      <PartnersSection content={content.partners} />
      <ServicesSection content={content.services} />
      <SolutionsSection content={content.solutions} />
      <WhyUsSection content={content.whyUs} />
      <FeaturedProjectsSection content={content.featuredProjects} projects={projects} />
      <TestimonialSection title={content.testimonials.title} description={content.testimonials.description} testimonials={content.testimonials.items} />
      <EquipmentOfferSection content={content.equipmentOffer} equipment={equipment} />
      <FaqSection content={content.faq} />
      <ContactSection content={content.contact} />
    </>
  );
}
