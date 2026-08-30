import { Guia } from "./tipos";
import { guiasBasicas } from "./guias-basicas";
import { guiasAvanzadas } from "./guias-avanzadas";
import { guiasProyecto } from "./guias-proyecto";

/** Índice de todas las guías (el sitemap y el índice /guia/ salen de acá). */
export function todasLasGuias(): Guia[] {
  return [...guiasBasicas(), ...guiasAvanzadas(), ...guiasProyecto()];
}

export function getGuia(slug: string): Guia | undefined {
  return todasLasGuias().find((g) => g.slug === slug);
}

export { type Guia, type Bloque, type Faq } from "./tipos";
