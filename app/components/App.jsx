import styles from "./App.module.css";
import RubberDuck from "./RubberDuck" // A vibe-coded duck, he's pretty cool
import fonts from "./Fonts.module.css"
import Chat from "./Chat"
import Navbar from "./Navbar"
import AddSnippetModal from "./AddSnippetModal"
import { SnippetsProvider } from "./SnippetsContext";

// The screen frame: sidebar on the left, navbar + page content on the right.
// Rendered once by app/layout.jsx; the current page (page.jsx) arrives as `children`.
// Snippet data and the modal's open/closed state live in <SnippetsProvider>, not here.
export default function App({ children }) {
  return (
    <SnippetsProvider>
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
          <Navbar />
          <main className={styles.main}>{children}</main>
        </div>
        <AddSnippetModal />
      </div>
    </SnippetsProvider>
  );
}
