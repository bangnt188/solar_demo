import { ActionLink } from "@/components/atoms/action-link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { solutionOverviewContent } from "@/data/content/solutions";
import { pageStructuredData } from "@/lib/seo";

const path = "/giai-phap/" as const;

export function SolutionsOverviewScreen() {
  const { hero, needs, systems, buildingTypes, process, investment, closing } = solutionOverviewContent;

  return (
    <>
      <JsonLd data={pageStructuredData(path)} />
      <section className="solution-page-hero" aria-labelledby="solutions-title">
        <div className="container">
          <div className="hero-copy">
            <h1 id="solutions-title">{hero.title}</h1>
            <p>{hero.description}</p>
            <div className="hero-actions">
              <ActionLink className="hero-btn-primary" href={hero.primaryHref}>{hero.primaryLabel}</ActionLink>
              <ActionLink className="hero-btn-outline" href={hero.secondaryHref}>{hero.secondaryLabel}</ActionLink>
            </div>
          </div>
        </div>
      </section>
      <section className="section solution-needs" id="needs" aria-labelledby="solution-needs-title">
        <div className="container">
          <div className="solution-needs-intro" data-motion="up">
            <SectionHeading id="solution-needs-title" title={needs.title} description={needs.description} />
          </div>
          <div className="solution-needs-grid">
            {needs.items.map((item, index) => (
              <article className="solution-need" data-motion="up" data-motion-order={index} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section solution-systems" id="systems" aria-labelledby="solution-systems-title">
        <div className="container">
          <div className="solution-section-intro" data-motion="up">
            <SectionHeading id="solution-systems-title" title={systems.title} description={systems.description} />
          </div>
          <div className="solution-system-grid">
            {systems.items.map((system, index) => (
              <article className="solution-system-card" data-motion="up" data-motion-order={index} key={system.title}>
                <span className="solution-system-scenario">{system.scenario}</span>
                <h3>{system.title}</h3>
                <p>{system.description}</p>
                <ul>{system.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <div className="solution-audiences">
                  <strong>Phù hợp với</strong>
                  <ul>{system.audiences.map((audience) => <li key={audience}>{audience}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section solution-building-types" id="building-types" aria-labelledby="solution-buildings-title">
        <div className="container">
          <div className="solution-section-intro" data-motion="up">
            <SectionHeading id="solution-buildings-title" title={buildingTypes.title} description={buildingTypes.description} />
          </div>
          <div className="solution-building-grid">
            {buildingTypes.items.map((building, index) => (
              <article className="solution-building-card" data-motion="up" data-motion-order={index} id={"anchor" in building ? building.anchor : undefined} key={building.title}>
                <h3>{building.title}</h3>
                <p>{building.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section solution-process" id="process" aria-labelledby="solution-process-title">
        <div className="container">
          <div className="solution-section-intro" data-motion="up">
            <SectionHeading id="solution-process-title" title={process.title} description={process.description} />
          </div>
          <div className="solution-process-list">
            {process.steps.map((step, index) => (
              <article className={`solution-process-step${index % 2 === 1 ? " solution-process-step-reversed" : ""}`} data-motion="up" data-motion-order={index} key={step.title} aria-labelledby={`solution-process-step-${index + 1}`}>
                <div className="solution-process-heading">
                  <span className="solution-process-number" aria-hidden="true">{index + 1}</span>
                  <div>
                    <h3 id={`solution-process-step-${index + 1}`}>{step.title}</h3>
                    {step.turnaround && <p className="solution-process-time">{step.turnaround}</p>}
                  </div>
                </div>
                <ul className="solution-process-tasks">{step.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section solution-investment" id="investment" aria-labelledby="solution-investment-title">
        <div className="container">
          <div className="solution-investment-intro" data-motion="up">
            <SectionHeading id="solution-investment-title" title={investment.title} description={investment.description} />
          </div>
          <div className="solution-investment-grid">
            {investment.models.map((model, index) => (
              <article className={`solution-investment-card${index === 1 ? " solution-investment-card-featured" : ""}`} data-motion="up" data-motion-order={index} key={model.title}>
                {"badge" in model && <span className="solution-investment-badge">{model.badge}</span>}
                <h3>{model.title}</h3>
                <p>{model.fit}</p>
                <dl>{model.terms.map((term) => (
                  <div key={term.label}>
                    <dt>{term.label}</dt>
                    <dd>{term.value}</dd>
                  </div>
                ))}</dl>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="solution-closing" aria-labelledby="solution-closing-title">
        <div className="container solution-closing-inner">
          <div data-motion="left">
            <h2 id="solution-closing-title">{closing.title}</h2>
            <p>{closing.description}</p>
            <ActionLink className="hero-btn-outline" href={closing.actionHref}>{closing.actionLabel}</ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
