import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import ThemeToggle from "./theme-toggle";
import { themeScript } from "./theme-script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serifEditorial = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maternidad.ar — Embarazo, licencias y asignaciones en Argentina",
    template: "%s | Maternidad.ar",
  },
  description:
    "Calculadoras de embarazo, licencia por maternidad y asignaciones de ANSES con montos oficiales vigentes, fuente citada y lenguaje claro. Gratis, sin registro.",
  metadataBase: new URL("https://maternidad-ar.pages.dev"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning className={`${inter.variable} ${serifEditorial.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              Maternidad<span className="acento">.ar</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden gap-4 sm:flex" aria-label="Navegación principal">
                <Link href="/calculadora-de-embarazo/" className="hover:text-rose-700 dark:hover:text-rose-300">
                  Embarazo
                </Link>
                <Link href="/licencia-por-maternidad/" className="hover:text-rose-700 dark:hover:text-rose-300">
                  Licencia
                </Link>
                <Link href="/asignacion-por-embarazo/" className="hover:text-rose-700 dark:hover:text-rose-300">
                  Asignaciones
                </Link>
                <Link href="/guia/" className="hover:text-rose-700 dark:hover:text-rose-300">
                  Guías
                </Link>
                <Link href="/semana/" className="hover:text-rose-700 dark:hover:text-rose-300">
                  Semanas
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="mt-12 border-t border-neutral-200 py-6 text-center dark:border-neutral-800">
          <p className="caption mb-2 flex flex-wrap justify-center gap-3">
            <Link href="/quienes-somos/" className="hover:text-rose-700 dark:hover:text-rose-300">
              Quiénes somos
            </Link>
            <Link href="/privacidad/" className="hover:text-rose-700 dark:hover:text-rose-300">
              Privacidad
            </Link>
            <Link href="/terminos/" className="hover:text-rose-700 dark:hover:text-rose-300">
              Términos
            </Link>
            <Link href="/guia/" className="hover:text-rose-700 dark:hover:text-rose-300">
              Guías
            </Link>
            <Link href="/semana/" className="hover:text-rose-700 dark:hover:text-rose-300">
              Semana a semana
            </Link>
          </p>
          <p className="caption mx-auto max-w-2xl px-4">
            Herramienta informativa. No reemplaza la consulta con tu médico ni el asesoramiento
            legal o previsional. Datos: ANSES, Ley 20.744 (LCT) y Ministerio de Salud.
          </p>
          <p className="caption mt-1">© {new Date().getFullYear()} Maternidad.ar</p>
        </footer>
      </body>
    </html>
  );
}
