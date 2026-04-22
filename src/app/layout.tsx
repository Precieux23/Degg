import type { Metadata, Viewport } from "next"; // Ajout de Viewport ici
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. Les métadonnées classiques (SEO, Manifest)
export const metadata: Metadata = {
  title: "DÉGG — Traduction JOJ Dakar 2026",
  description: "Traduction instantanée pour les Jeux Olympiques de la Jeunesse Dakar 2026",
  manifest: "/manifest.json",
};

// 2. La configuration du Viewport (Couleur du thème, zoom, etc.)
export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  );
}