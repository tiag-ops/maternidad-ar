"use client";

import { useSyncExternalStore } from "react";

/** Lee el tema desde la clase .dark de <html> (la setea el script anti-flash). */
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

const getSnapshot = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = () => "light";

/** Toggle claro/oscuro. Persiste en localStorage ('tema').
 * Default: preferencia del sistema. Sin flash al cargar (script en <head>). */
export default function ThemeToggle() {
  const tema = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const nuevo = tema === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nuevo === "dark");
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      /* storage bloqueado: el toggle funciona igual en la sesión */
    }
  }

  return (
    <button
      type="button"
      aria-label={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={tema === "dark" ? "Modo claro" : "Modo oscuro"}
      onClick={toggle}
      className="rounded-lg border border-neutral-300 px-2.5 py-1.5 transition-colors hover:border-rose-500 dark:border-neutral-700 dark:hover:border-rose-500"
    >
      {tema === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
