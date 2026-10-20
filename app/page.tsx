import { ConceptImage, type ImageSlot } from "@/components/ConceptImage";
import { Navigation } from "@/components/Navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import { OutlineIcon, type IconName } from "@/components/OutlineIcon";
import styles from "./page.module.css";

type ConceptProject = {
  name: string;
  setting: string;
  description: string;
  image: ImageSlot;
  sizes: string;
  alt: string;
};

// Match the 12-column project wall and its 1920px content limit.
const projectSizes = {
  courtyard: "calc((min(100vw, 1920px) - 64px - 264px) * 7 / 12 + 144px)",
  ridge: "calc((min(100vw, 1920px) - 64px - 264px) * 5 / 12 + 96px)",
  woodland: "calc((min(100vw, 1920px) - 64px - 264px) * 10 / 12 + 216px)",
};

function projectImageSizes(desktop: string) {
  return `(max-width: 599px) calc(100vw - 32px), (max-width: 899px) calc(100vw - 48px), ${desktop}`;
}

const projects: ConceptProject[] = [
  {
    name: "Courtyard House",
    setting: "A sheltered garden",
    description:
      "A home gathered around an open courtyard. Pale mineral walls hold the summer shade, while a planted centre brings daylight into the rooms.",
    image: "courtyard",
    sizes: projectImageSizes(projectSizes.courtyard),
    alt: "Concept visualisation: a planted courtyard enclosed by pale walls and timber eaves, opening into a living room.",
  },
  {
    name: "Ridge House",
    setting: "An open horizon",
    description:
      "A low dwelling following the contour of a hillside. Deep roof overhangs shelter outdoor living, with long views from a shared kitchen and sitting room.",
    image: "ridge",
    sizes: projectImageSizes(projectSizes.ridge),
    alt: "Concept visualisation: a low stone house on a planted slope, with a deep timber eave and views across distant hills.",
  },
  {
    name: "Woodland Retreat",
    setting: "Among the trees",
    description:
      "A compact retreat with a timber interior and a protected entrance. Small, private rooms open towards the trees; a generous table anchors daily life.",
    image: "woodland",
    sizes: projectImageSizes(projectSizes.woodland),
    alt: "Concept visualisation: a compact timber home among trees, with a sheltered entrance and a shared table visible inside.",
  },
];

type Service = { name: string; description: string; icon: IconName };

const services: Service[] = [
  {
    name: "Architecture",
    icon: "architecture",
    description:
      "Site studies, spatial planning and a residential concept shaped around the way you live.",
  },
  {
    name: "Interiors",
    icon: "interiors",
    description:
      "Room layouts, built-in furniture and a restrained material palette, considered alongside the architecture.",
  },
  {
    name: "Landscape",
    icon: "landscape",
    description:
      "Courtyards, terraces and planted thresholds that connect the home to its surroundings.",
  },
];

const stages: Service[] = [
  {
    name: "Listen",
    icon: "listen",
    description:
      "Begin with your daily routines, the site, your priorities and a realistic budget.",
  },
  {
    name: "Explore",
    icon: "explore",
    description:
      "Test the position of the home, the quality of light and the connections between rooms.",
  },
  {
    name: "Resolve",
    icon: "resolve",
    description:
      "Develop the chosen direction through materials, details and coordinated drawings.",
  },
  {
    name: "Realise",
    icon: "realise",
    description:
      "Plan the route to construction with the right specialists and a clear scope of work.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <ConceptImage
            slot="hero"
            frameClassName={styles.heroFrame}
            imageClassName={styles.heroImage}
            sizes="100vw"
            alt="Concept visualisation: a low mineral home with a timber canopy, an open living space and a stone path through a planted garden."
            priority
          />
          <div className={styles.heroBand}>
            <h1 id="hero-title" className={styles.monument}>
              KILN
            </h1>
            <div className={styles.heroIntro}>
              <p>
                Residential architecture.
                <br />
                Shaped by the land. Made for living.
              </p>
              <a href="#contact" className={styles.button}>
                Discuss your project <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <section
          id="projects"
          tabIndex={-1}
          className={styles.projects}
          aria-labelledby="projects-title"
        >
          <div className={styles.sectionIntro}>
            <h2 id="projects-title">Living studies</h2>
            <p>
              Three residential concepts exploring shelter, light and the
              landscape. Fictional projects, illustrated with AI-generated imagery.
            </p>
          </div>
          <div className={styles.projectWall}>
            {projects.map((project) => (
              <article key={project.name} className={styles.project}>
                <figure>
                  <ConceptImage
                    slot={project.image}
                    sizes={project.sizes}
                    alt={project.alt}
                  />
                </figure>
                <div className={styles.projectCaption}>
                  <div className={styles.projectIdentity}>
                    <div className={styles.projectTitle}>
                      <h3>{project.name}</h3>
                      <span>Concept</span>
                    </div>
                    <p className={styles.setting}>{project.setting}</p>
                  </div>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="studio"
          tabIndex={-1}
          className={styles.studio}
          aria-labelledby="studio-title"
        >
          <div className={styles.studioIntro}>
            <h2 id="studio-title">The studio</h2>
            <p className={styles.statement}>
              Like clay in a kiln, a home takes its character from the material,
              the conditions and the care that shapes it.
            </p>
          </div>
          <div className={styles.studioBody}>
            <div className={styles.studioNote}>
              <OutlineIcon name="site" className={styles.sectionIcon} />
              <div>
                <h3>A sense of place</h3>
                <p>
                  KILN is a fictional architecture practice exploring contemporary
                  homes in natural settings. The starting point is the ground
                  beneath the building: its slope, its light and the places where
                  you want to pause.
                </p>
              </div>
            </div>
            <div className={styles.studioNote}>
              <OutlineIcon name="material" className={styles.sectionIcon} />
              <div>
                <h3>Material &amp; light</h3>
                <p>
                  Stone, timber and mineral surfaces give each concept a tactile
                  character. Generous openings and sheltered edges make room for
                  life between indoors and out.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="services"
          tabIndex={-1}
          className={styles.services}
          aria-labelledby="services-title"
        >
          <div className={styles.sectionIntro}>
            <h2 id="services-title">Considered together</h2>
            <p>
              Architecture, interiors and landscape belong to the same
              conversation. These are the services imagined for the KILN
              practice.
            </p>
          </div>
          <ul className={styles.serviceColumns}>
            {services.map((service) => (
              <li key={service.name}>
                <OutlineIcon name={service.icon} className={styles.sectionIcon} />
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section
          id="process"
          tabIndex={-1}
          className={styles.process}
          aria-labelledby="process-title"
        >
          <div>
            <h2 id="process-title">
              From ground
              <br />
              to home
            </h2>
            <p>
              A clear sequence, with space to question and refine. An
              illustration of how a residential project could develop.
            </p>
          </div>
          <ol className={styles.processList}>
            {stages.map((stage) => (
              <li key={stage.name}>
                <div className={styles.stageHeading}>
                  <OutlineIcon name={stage.icon} className={styles.sectionIcon} />
                  <h3>{stage.name}</h3>
                </div>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          id="contact"
          tabIndex={-1}
          className={styles.contact}
          aria-labelledby="contact-title"
        >
          <div className={styles.contactIntro}>
            <h2 id="contact-title">
              A place
              <br />
              to begin
            </h2>
            <p>
              What do you imagine for your home? Try the demo with a setting, a
              material or a way you want to live.
            </p>
            <p>
              Please use sample details. KILN is a portfolio concept, and this
              form does not contact a studio.
            </p>
          </div>
          <EnquiryForm />
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <p>
            KILN is a fictional studio.
            <br />
            All projects are demonstration concepts.
          </p>
          <a href="#main">Back to top</a>
        </div>
        <p className={styles.footerNote}>
          Original concept imagery created with ImageGen. These are imagined homes,
          not completed commissions.
        </p>
        <p className={styles.footerName} aria-hidden="true">
          KILN
        </p>
      </footer>
    </>
  );
}
