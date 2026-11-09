import styles from "./AppLayout.module.css";
import RubberDuck from "./RubberDuck" // A vibe-coded duck, he's pretty cool
import fonts from "./Fonts.module.css"
import Chat from "./Chat"

// Three-way Layout!
export default function AppLayout({ children }) {
  return (
    <div className={styles.shell}>
      {/* dis the sidebar*/}
      <aside className={styles.sidebar}>
        <p className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText}`} >Quax, your snippet assistant</p>
        <p className={`${fonts.dmSans300} ${fonts.textSize14} ${fonts.grayText}` }>Ask for a template. It becomes a card you can keep.</p>
        <div className={styles.fullWidth} > <RubberDuck /> </div>
        <div className={styles.ChatSection} ><Chat /></div>
      </aside>

      {/* wow, ts the right section. nav stuff on top, main content with cards on bottom */}
      <div className={styles.right}>
        <header className={styles.navbar}>
          <span className={`${fonts.dmSans800} ${fonts.textSize18} ${fonts.whiteText}`}>Snippet Vault</span>
          <div>{/* nav stuff go here */}</div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
