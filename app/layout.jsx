// app/layout.jsx - the root layout. It must render <html> and <body>, and wraps every page.
// It only sets up the document; the visible screen frame (sidebar, navbar) lives in <App>.
import "./globals.css";
import App from "./components/App";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
