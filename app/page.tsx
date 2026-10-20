import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.wordmark}>KILN</p>
        <p className={styles.label}>Luxury Architects</p>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Residential architecture</p>
        <h1 className={styles.title}>A sense of place.</h1>
        <p className={styles.description}>
          Contemporary homes shaped by their surroundings, with natural materials
          and space for everyday life.
        </p>
      </main>
      <footer className={styles.footer}>
        <p>Portfolio concept. KILN is a fictional architecture studio.</p>
      </footer>
    </div>
  );
}
