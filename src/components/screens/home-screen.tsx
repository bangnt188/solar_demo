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
import type { ReactNode } from "react";
import type { HomeContent } from "@/types/home-content";
import type { LandingView, SectionKey } from "@/types/landing";

// Dynamic configuration selects only pre-built, typed renderers; never code/HTML.
const sections: { [K in SectionKey]: (content: HomeContent[K], landing: LandingView) => ReactNode } = {
  hero: content => <HeroSection content={content} />,
  partners: content => <PartnersSection content={content} />,
  services: content => <ServicesSection content={content} />,
  solutions: content => <SolutionsSection content={content} />,
  whyUs: content => <WhyUsSection content={content} />,
  featuredProjects: (content, landing) => <FeaturedProjectsSection content={content} projects={landing.projects} />,
  testimonials: content => <TestimonialSection title={content.title} description={content.description} testimonials={content.items} />,
  equipmentOffer: (content, landing) => <EquipmentOfferSection content={content} equipment={landing.equipment} />,
  faq: content => <FaqSection content={content} />,
  contact: content => <ContactSection content={content} />,
};
function renderSection<K extends SectionKey>(section: { key: K; content: HomeContent[K] }, landing: LandingView) {
  return sections[section.key](section.content, landing);
}
export function HomeScreen({ landing }: { landing: LandingView }) {
  return <>{landing.sections.map(section => <SectionRenderer key={section.key} section={section} landing={landing} />)}</>;
}

function SectionRenderer({ section, landing }: { section: LandingView["sections"][number]; landing: LandingView }) { return renderSection(section, landing); }
