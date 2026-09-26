import { homeContent } from "@/data/content/home";
import { getEquipment, getProjects } from "@/services/catalog";
import { Contact, EquipmentOffer, Faq, FeaturedProjects, Hero, Partners, Services, Solutions, WhyUs } from "@/components/sections/home-sections";

export default function Home() {
  return (
    <>
      <Hero content={homeContent.hero} />
      <Partners content={homeContent.partners} />
      <Services content={homeContent.services} />
      <Solutions content={homeContent.solutions} />
      <WhyUs content={homeContent.whyUs} />
      <FeaturedProjects content={homeContent.featuredProjects} projects={getProjects()} />
      <EquipmentOffer content={homeContent.equipmentOffer} equipment={getEquipment()} />
      <Faq content={homeContent.faq} />
      <Contact content={homeContent.contact} />
    </>
  );
}
