"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/calculadora-de-embarazo/", texto: "Embarazo" },
  { href: "/licencia-por-maternidad/", texto: "Licencia" },
  { href: "/asignacion-por-embarazo/", texto: "Asignaciones" },
  { href: "/guia/", texto: "Guías" },
  { href: "/semana/", texto: "Semana a semana" },
];

const SECUNDARIOS = [
  { href: "/quienes-somos/", texto: "Quiénes somos" },
  { href: "/privacidad/", texto: "Privacidad" },
  { href: "/terminos/", texto: "Términos" },
];

/** Menú desplegable mobile (drawer izquierdo + backdrop). Solo < sm.
 * Sin setState en effects (regla de CI): Escape cierra vía handler de evento. */
export default function NavMobile() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // sin scroll de fondo con el drawer abierto
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-mobile"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto(!abierto)}
        className="rounded-lg border border-neutral-300 px-2.5 py-1.5 dark:border-neutral-700"
      >
        <span aria-hidden>{abierto ? "✕" : "☰"}</span>
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-20"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-neutral-950/50"
          />
          <nav
            id="menu-mobile"
            className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl dark:bg-neutral-900"
          >
            <p className="caption mb-3">Navegación</p>
            <ul className="mb-6">
              {LINKS.map((l) => (
                <li key={l.href} className="border-b border-neutral-100 dark:border-neutral-800">
                  <Link
                    href={l.href}
                    onClick={() => setAbierto(false)}
                    className="block py-3 text-[15px] font-medium text-neutral-900 hover:text-rose-700 dark:text-neutral-100 dark:hover:text-rose-300"
                  >
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="caption mb-2">Sitio</p>
            <ul>
              {SECUNDARIOS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setAbierto(false)}
                    className="block py-2 text-[13px] text-neutral-600 hover:text-rose-700 dark:text-neutral-400 dark:hover:text-rose-300"
                  >
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
