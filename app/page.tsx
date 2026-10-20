import { Navigation } from "@/components/Navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import styles from "./page.module.css";

type ConceptProject = {
  name: string;
  setting: string;
  description: string;
  image: string;
  alt: string;
  photographer: string;
  source: string;
};

const projects: ConceptProject[] = [
  {
    name: "Courtyard House",
    setting: "A sheltered garden",
    description: "A home gathered around an open courtyard. Pale mineral walls hold the summer shade, while a planted centre brings daylight into the rooms.",
    image: "courtyard",
    alt: "Temporary reference: a narrow opening in a pale wall frames a white staircase.",
    photographer: "Todd Quackenbush",
    source: "https://unsplash.com/photos/JJB_K8aCPU4",
  },
  {
    name: "Ridge House",
    setting: "An open horizon",
    description: "A low dwelling following the contour of a hillside. Deep roof overhangs shelter outdoor living, with long views from a shared kitchen and sitting room.",
    image: "ridge",
    alt: "Temporary reference: stepped white architecture seen against a clear blue sky.",
    photographer: "Julien Moreau",
    source: "https://unsplash.com/photos/688Fna1pwOQ",
  },
  {
    name: "Woodland Retreat",
    setting: "Among the trees",
    description: "A compact retreat with a timber interior and a protected entrance. Small, private rooms open towards the trees; a generous table anchors daily life.",
    image: "woodland",
    alt: "Temporary material reference: a carved timber door set within an aged stone facade.",
    photographer: "Paul Evans",
    source: "https://unsplash.com/photos/CtkDsu4w-Rs",
  },
];

const services = [
  { name: "Architecture", description: "Site studies, spatial planning and a residential concept shaped around the way you live." },
  { name: "Interiors", description: "Room layouts, built-in furniture and a restrained material palette, considered alongside the architecture." },
  { name: "Landscape", description: "Courtyards, terraces and planted thresholds that connect the home to its surroundings." },
];

const stages = [
  { name: "Listen", description: "Begin with your daily routines, the site, your priorities and a realistic budget." },
  { name: "Explore", description: "Test the position of the home, the quality of light and the connections between rooms." },
  { name: "Resolve", description: "Develop the chosen direction through materials, details and coordinated drawings." },
  { name: "Realise", description: "Plan the route to construction with the right specialists and a clear scope of work." },
];

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <picture>
            <source media="(max-width: 600px)" srcSet="/assets/temporary/hero-small.jpg" />
            <img className={styles.heroImage} src="/assets/temporary/hero.jpg" width={2000} height={1333} alt="Temporary architectural reference: a contemporary stone and concrete house opens onto a planted garden." fetchPriority="high" />
          </picture>
          <div className={styles.heroBand}>
            <h1 id="hero-title" className={styles.monument}>KILN</h1>
            <div className={styles.heroIntro}>
              <p>Residential architecture.<br />Shaped by the land. Made for living.</p>
              <a href="#contact" className={styles.button}>Discuss your project <span aria-hidden="true">↗</span></a>
            </div>

          </div>
          <p className={styles.heroCredit}>Temporary reference by <a href="https://unsplash.com/photos/eWOgoFHlE8g">Aalo Lens / Unsplash</a>. Not a KILN project.</p>
        </section>
        <section id="projects" className={styles.projects} aria-labelledby="projects-title">
          <div className={styles.sectionIntro}>
            <h2 id="projects-title">Living studies</h2>
            <p>Three residential concepts exploring shelter, light and the landscape. Fictional projects, with temporary reference imagery.</p>
          </div>
          <div className={styles.projectWall}>
            {projects.map((project) => (
              <article key={project.name} className={styles.project}>
                <figure>
                  <picture><img src={"/assets/temporary/" + project.image + ".jpg"} width={1200} height={1000} loading="lazy" decoding="async" alt={project.alt} /></picture>
                  <figcaption>Temporary reference: <a href={project.source}>{project.photographer} / Unsplash</a></figcaption>
                </figure>
                <div className={styles.projectTitle}><h3>{project.name}</h3><span>Concept</span></div>
                <p className={styles.setting}>{project.setting}</p>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="studio" className={styles.studio} aria-labelledby="studio-title">
          <h2 id="studio-title">The studio</h2>
          <div className={styles.studioBody}>
            <p className={styles.statement}>Like clay in a kiln, a home takes its character from the material, the conditions and the care that shapes it.</p>
            <p>KILN is a fictional architecture practice exploring contemporary homes in natural settings. The starting point is the ground beneath the building: its slope, its light and the places where you want to pause.</p>
            <p>Stone, timber and mineral surfaces give each concept a tactile character. Generous openings and sheltered edges make room for life between indoors and out.</p>
          </div>
        </section>
        <section id="services" className={styles.services} aria-labelledby="services-title">
          <div className={styles.sectionIntro}><h2 id="services-title">Considered together</h2><p>Architecture, interiors and landscape belong to the same conversation. These are the services imagined for the KILN practice.</p></div>
          <div className={styles.serviceColumns}>{services.map((service) => <div key={service.name}><h3>{service.name}</h3><p>{service.description}</p></div>)}</div>
        </section>
        <section id="process" className={styles.process} aria-labelledby="process-title">
          <div><h2 id="process-title">From ground<br />to home</h2><p>A clear sequence, with space to question and refine. An illustration of how a residential project could develop.</p></div>
          <ol className={styles.processList}>{stages.map((stage) => <li key={stage.name}><h3>{stage.name}</h3><p>{stage.description}</p></li>)}</ol>
        </section>
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <div className={styles.contactIntro}><h2 id="contact-title">A place<br />to begin</h2><p>What do you imagine for your home? Try the demo with a setting, a material or a way you want to live.</p><p>Please use sample details. KILN is a portfolio concept, and this form does not contact a studio.</p></div>
          <EnquiryForm />
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}><p>KILN is a fictional studio.<br />All projects are demonstration concepts.</p><a href="#main">Back to top</a></div>
        <p className={styles.footerNote}>Temporary imagery is credited beside each image. <a href="https://unsplash.com/license">Unsplash License</a>. Original project imagery follows in a later stage.</p>
        <p className={styles.footerName} aria-hidden="true">KILN</p>
      </footer>
    </>
  );
}
