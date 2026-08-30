/** Loader de semana-a-semana (build-time). Datos evergreen: nunca los toca el cron. */

import datos from "@/data/semana-a-semana.json";

export interface Semana {
  n: number;
  tamano: string;
  medidaCm: number | null;
  desarrollo: string;
  control: string;
}

interface DatosSemanas {
  fuente: string;
  urlFuente: string;
  actualizadoEl: string;
  nota: string;
  semanas: Semana[];
}

const d = datos as DatosSemanas;

export const TOTAL_SEMANAS = 40;

export function getSemana(n: number): Semana | undefined {
  return d.semanas.find((s) => s.n === n);
}

export function todasLasSemanas(): Semana[] {
  return d.semanas;
}

export function metadataSemanas(): { fuente: string; url: string; nota: string } {
  return { fuente: d.fuente, url: d.urlFuente, nota: d.nota };
}

/** Trimestre según semana (1-13 T1, 14-27 T2, 28-40 T3). */
export function trimestreDeSemana(n: number): 1 | 2 | 3 {
  if (n <= 13) return 1;
  if (n <= 27) return 2;
  return 3;
}
