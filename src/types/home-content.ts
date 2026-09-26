export type HomeHeroContent = {
  title: string;
  tagline: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  image: string;
  imageAlt: string;
  bottomImage: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  partners: { title: string; brandsLabel: string; brands: { name: string; emphasis: boolean }[] };
  services: {
    heading: string;
    introduction: string;
    items: { title: string; image: string; points: string[] }[];
  };
  solutions: {
    heading: string;
    introduction: string;
    actionHref: string;
    items: { title: string; text: string; image: string; icon: string; actionLabel: string }[];
  };
  whyUs: {
    heading: string;
    banner: string;
    paragraphs: string[];
    images: { image: string; alt: string }[];
  };
  featuredProjects: { heading: string; viewAllLabel: string; viewAllHref: string };
  testimonials: { title: string; description: string; items: { quote: string; name: string; role: string; location: string; system: string }[] };
  equipmentOffer: { heading: string; viewAllLabel: string; viewAllHref: string };
  faq: {
    heading: string;
    introduction: string;
    image: string;
    imageAlt: string;
    actionLabel: string;
    actionHref: string;
    questions: { title: string; text: string }[];
  };
  contact: { heading: string[]; description: string; actionLabel: string; actionHref: string };
};
