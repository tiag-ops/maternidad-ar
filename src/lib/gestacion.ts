/** Motor de gestación — funciones PURAS (sin DOM/fetch/React).
 * Convenciones: edad gestacional se cuenta desde la LMP (día 0 = primer día
 * de la última menstruación). Embarazo de término: 280 días (40 semanas).
 * FIV día 5 (blastocisto): FPP = transferencia + 261 días (EG en transferencia = 19 días).
 * FIV día 3: FPP = transferencia + 263 días (EG en transferencia = 17 días).
 * Regla de Naegele ajustada por ciclo: FPP = LMP + 280 + (ciclo − 28).
 * Verificado 2026-08-29 contra los canarios del plan (§4.1). */

import { parsearFecha, sumarDias, diffDias, aISO } from "./fechas";

export const DIAS_GESTACION = 280;
/** 42 semanas: postérmino (borde superior fisiológico). */
export const MAX_DIAS = 294;

export type FivDia = 3 | 5;

export interface DatosCalculo {
  /** Primer día de la última menstruación. */
  lmp?: string;
  /** Duración habitual del ciclo (20–45; default 28). */
  ciclo?: number;
  /** Fecha de transferencia embrionaria (modo FIV). */
  fivTransferencia?: string;
  /** Día del embrión transferido. */
  fivDia?: FivDia;
}

export interface EstadoGestacional {
  fpp: string;
  lmpEquivalente: string;
  hoy: string;
  diasGestacionales: number;
  semanas: number;
  diasDeSemana: number;
  trimestre: 1 | 2 | 3;
  diasParaFpp: number;
  /** 0–100 con 1 decimal. */
  progresoPct: number;
  /** Más de 42 semanas. */
  postTermino: boolean;
}

/** FPP a partir de LMP+ciclo o de datos de FIV. Prioridad: FIV > LMP. */
export function calcularFpp(datos: DatosCalculo): string {
  if (datos.fivTransferencia) {
    if (datos.fivDia !== 3 && datos.fivDia !== 5) {
      throw new Error("Para FIV indicá el día del embrión transferido: 3 o 5.");
    }
    return sumarDias(datos.fivTransferencia, datos.fivDia === 5 ? 261 : 263);
  }
  if (!datos.lmp) {
    throw new Error("Falta la fecha de la última menstruación (o los datos de FIV).");
  }
  const ciclo = datos.ciclo ?? 28;
  if (!Number.isInteger(ciclo) || ciclo < 20 || ciclo > 45) {
    throw new Error("La duración del ciclo debe estar entre 20 y 45 días.");
  }
  return sumarDias(datos.lmp, DIAS_GESTACION + (ciclo - 28));
}

/** Estado completo a una fecha dada (hoy inyectable para determinismo). */
export function estadoGestacional(
  datos: DatosCalculo & { hoy: string },
): EstadoGestacional {
  const fpp = calcularFpp(datos);
  const lmpEquivalente = sumarDias(fpp, -DIAS_GESTACION);
  const diasGestacionales = diffDias(lmpEquivalente, datos.hoy);
  if (diasGestacionales < 0) {
    throw new Error(
      "La fecha ingresada es posterior al día de hoy. Revisá la fecha (tiene que ser la primera del último sangrado).",
    );
  }
  const semanas = Math.floor(diasGestacionales / 7);
  const trimestre: 1 | 2 | 3 = diasGestacionales < 98 ? 1 : diasGestacionales < 196 ? 2 : 3;
  return {
    fpp,
    lmpEquivalente,
    hoy: datos.hoy,
    diasGestacionales,
    semanas,
    diasDeSemana: diasGestacionales % 7,
    trimestre,
    diasParaFpp: Math.max(0, diffDias(datos.hoy, fpp)),
    progresoPct: Math.min(100, Math.round((diasGestacionales / DIAS_GESTACION) * 1000) / 10),
    postTermino: diasGestacionales > MAX_DIAS,
  };
}

/** Ovulación estimada (día ciclo−14) y ventana fértil (ovulación −5 a +1). */
export interface VentanaFertil {
  ovulacion: string;
  inicio: string;
  fin: string;
}

export function ventanaFertil(datos: { lmp: string; ciclo?: number }): VentanaFertil {
  const ciclo = datos.ciclo ?? 28;
  if (!Number.isInteger(ciclo) || ciclo < 20 || ciclo > 45) {
    throw new Error("La duración del ciclo debe estar entre 20 y 45 días.");
  }
  const ovulacion = sumarDias(datos.lmp, ciclo - 14);
  return { ovulacion, inicio: sumarDias(ovulacion, -5), fin: sumarDias(ovulacion, 1) };
}

/** Hitos estándar del control prenatal (informativo; el médico puede indicar otros). */
export interface Hito {
  semana: number;
  titulo: string;
  detalle: string;
}

export const HITOS: Hito[] = [
  {
    semana: 12,
    titulo: "Tamizaje del primer trimestre",
    detalle:
      "Entre las semanas 11 y 13+6: ecografía de 12 semanas (translucencia nuhal) y análisis de sangre.",
  },
  {
    semana: 20,
    titulo: "Ecografía morfológica",
    detalle: "Entre las semanas 18 y 22 se evalúa la anatomía del bebé.",
  },
  {
    semana: 24,
    titulo: "Umbral de viabilidad",
    detalle:
      "A partir de esta semana, un nacimiento prematuro tiene posibilidad de sobrevida con cuidados intensivos.",
  },
  {
    semana: 28,
    titulo: "Tercer trimestre",
    detalle:
      "Arranca el T3. En esta etapa se solicita el estudio de diabetes gestacional (curva glucémica).",
  },
  {
    semana: 37,
    titulo: "Término",
    detalle: "Entre las semanas 37 y 42 el bebé se considera de término.",
  },
];

/** Hitos que todavía no llegaron, ordenados. */
export function hitosRestantes(semanaActual: number): Hito[] {
  return HITOS.filter((h) => h.semana > semanaActual);
}

/** Reexport para comodidad de la UI. */
export { parsearFecha, aISO };
