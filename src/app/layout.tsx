import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Financial Stream Dashboard · Velinex",
  description: "Dashboard financiero de alto rendimiento con streaming SSE, escenarios de tesorería y AI Copilot."
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("financial-stream-dashboard-theme");
    var theme = stored || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-300`}>
        <ThemeProvider>
          <div vaul-drawer-wrapper="" className="min-h-screen bg-background">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
