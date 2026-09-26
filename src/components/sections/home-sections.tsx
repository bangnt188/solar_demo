import Image from "next/image";
import Link from "next/link";
import { EquipmentCard, ProjectCard } from "@/components/ui/catalog-cards";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";
import type { Equipment, Project } from "@/types/catalog";

export function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p className="hero-tagline">{content.tagline}</p>
          <p>{content.description}</p>
          <div className="actions">
            <Link className="button" href={content.primaryAction.href}>{content.primaryAction.label}</Link>
            <Link className="button button-outline" href={content.secondaryAction.href}>{content.secondaryAction.label}</Link>
          </div>
        </div>
        <div className="hero-visual"><Image src={imagePath(content.image)} alt={content.imageAlt} fill priority sizes="(max-width: 760px) 100vw, 55vw" /></div>
      </div>
      <div className="hero-bottom"><Image src={imagePath(content.bottomImage)} alt="" fill sizes="100vw" /></div>
    </section>
  );
}

export function Partners({ content }: { content: HomeContent["partners"] }) {
  return (
    <section className="partners">
      <div className="container partners-inner">
        <h2>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <div aria-label={content.brandsLabel}>{content.brands.map((brand) => <strong key={brand}>{brand} </strong>)}</div>
      </div>
    </section>
  );
}

export function Services({ content }: { content: HomeContent["services"] }) {
  return (
    <section className="section container" id="dich-vu">
      <h2 className="section-heading">{content.heading}</h2>
      <p className="section-lead">{content.introduction}</p>
      <div className="services">
        {content.items.map((service) => (
          <article className="service-row" key={service.title}>
            <div className="service-image"><Image src={imagePath(service.image)} alt={`Hình minh họa: ${service.title}`} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div className="service-copy"><h3>{service.title}</h3><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Solutions({ content }: { content: HomeContent["solutions"] }) {
  return (
    <section className="section solutions" id="giai-phap">
      <div className="container">
        <h2 className="section-heading">{content.heading.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <p className="section-lead">{content.introduction}</p>
        <div className="solution-grid">
          {content.items.map((solution) => (
            <article className="solution-card" key={solution.title}>
              <div className="solution-image"><Image src={imagePath(solution.image)} alt={`Hình minh họa: ${solution.title}`} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
              <span className="solution-icon" aria-hidden="true">{solution.icon}</span>
              <div className="solution-copy"><h3>{solution.title}</h3><p>{solution.text}</p><span>{solution.actionLabel}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs({ content }: { content: HomeContent["whyUs"] }) {
  return (
    <section className="section container" id="ve-chung-toi">
      <h2 className="section-heading">{content.heading}</h2>
      <div className="why-grid">
        <div className="why-gallery">
          <div className="why-image"><Image src={imagePath(content.images[0].image)} alt={content.images[0].alt} fill sizes="(max-width: 760px) 100vw, 40vw" /><span>{content.banner}</span></div>
          <div className="why-image why-small"><Image src={imagePath(content.images[1].image)} alt={content.images[1].alt} fill sizes="(max-width: 760px) 80vw, 25vw" /></div>
        </div>
        <div className="why-copy">
          {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="why-image why-panel"><Image src={imagePath(content.images[2].image)} alt={content.images[2].alt} fill sizes="(max-width: 760px) 100vw, 35vw" /></div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects({ content, projects }: { content: HomeContent["featuredProjects"]; projects: readonly Project[] }) {
  return (
    <section className="section container projects-section">
      <div className="heading-row"><h2 className="section-heading">{content.heading}</h2><Link href={content.viewAllHref}>{content.viewAllLabel}</Link></div>
      <div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}</div>
    </section>
  );
}

export function EquipmentOffer({ content, equipment }: { content: HomeContent["equipmentOffer"]; equipment: readonly Equipment[] }) {
  return (
    <section className="section container">
      <div className="offer"><h2>{content.heading}</h2><div className="offer-grid">
        {equipment.map((item) => <EquipmentCard item={item} key={item.title} />)}
      </div><Link href={content.viewAllHref}>{content.viewAllLabel}</Link></div>
    </section>
  );
}

export function Faq({ content }: { content: HomeContent["faq"] }) {
  return (
    <section className="section faq-section">
      <div className="container">
        <h2 className="section-heading">{content.heading}</h2>
        <p className="section-lead">{content.introduction}</p>
        <div className="faq-panel"><div className="faq-list">{content.questions.map((question, index) => (
          <article className="faq-item" key={question.title}><span>0{index + 1}</span><div><h3>{question.title}</h3><p>{question.text}</p></div></article>
        ))}</div><div className="faq-visual"><div className="faq-image"><Image src={imagePath(content.image)} alt={content.imageAlt} fill sizes="(max-width: 760px) 100vw, 40vw" /></div><Link className="faq-link" href={content.actionHref}>{content.actionLabel} <span aria-hidden="true">❯</span></Link></div></div>
      </div>
    </section>
  );
}

export function Contact({ content }: { content: HomeContent["contact"] }) {
  return (
    <section className="contact-section" id="lien-he">
      <div className="container"><h2>{content.heading.map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{content.description}</p><div className="contact-actions"><Link className="contact-button" href={content.actionHref}>{content.actionLabel} <span aria-hidden="true">❯</span></Link></div></div>
    </section>
  );
}
