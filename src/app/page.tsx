import { Contact, EquipmentOffer, Faq, FeaturedProjects, Hero, Partners, Services, Solutions, WhyUs } from "@/components/home-sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <Services />
      <Solutions />
      <WhyUs />
      <FeaturedProjects />
      <EquipmentOffer />
      <Faq />
      <Contact />
    </>
  );
}
