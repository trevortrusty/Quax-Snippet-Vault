// app/layout.jsx - the root layout. It must render <html> and <body>, and wraps every page.
import "./globals.css";
import AppLayout from "./components/AppLayout";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
