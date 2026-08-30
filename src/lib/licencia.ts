/** Motor de licencia por maternidad — funciones PURAS.
 * Base legal verificada 2026-08-29 contra argentina.gob.ar (texto oficial LCT 20.744):
 * - Art. 177 (texto según Ley 27.742, B.O. 8/7/2024): 45 días antes + 45 después.
 *   Opción: reducir el previo a no menos de 10 días → el resto se acumula al posterior (10+80).
 *   Prematuro: todo lo no gozado antes del parto se acumula al posterior (total 90).
 *   Estabilidad: derecho adquirido desde la notificación del embarazo con certificado con FPP.
 * - Art. 178: presunción de despido por maternidad dentro de los 7,5 meses anteriores
 *   o posteriores al parto.
 * - Art. 183: excedencia entre 3 y 6 meses; aviso dentro de las últimas 48 h de la licencia. */

import { sumarDias, sumarMeses, diffDias } from "./fechas";

export type OpcionLicencia = "45_45" | "10_80";

export const DIAS_LICENCIA = 90;

export const CITAS_LEGALES = {
  art177: "Ley 20.744 (LCT), art. 177 — texto según Ley 27.742 (B.O. 8/7/2024)",
  art178: "Ley 20.744 (LCT), art. 178 — presunción de despido por embarazo",
  art183: "Ley 20.744 (LCT), art. 183 — opción por excedencia",
} as const;

export interface Licencia {
  /** Primer día de licencia. */
  inicio: string;
  /** Último día de licencia (vuelve el día siguiente). */
  fin: string;
  diasTotales: number;
  opcion: OpcionLicencia;
  /** Fecha de parto usada como referencia. */
  fpp: string;
  /** Límite para avisar excedencia (48 h antes del fin, art. 185/186). */
  avisoExcedenciaLimite: string;
  excedenciaMinima: string;
  excedenciaMaxima: string;
  /** Ventana de presunción art. 178. */
  presuncionArt178: { desde: string; hasta: string };
  citas: string[];
}

/** Licencia estándar (parto en fecha). */
export function calcularLicencia(input: { fpp: string; opcion?: OpcionLicencia }): Licencia {
  const opcion = input.opcion ?? "45_45";
  const diasAntes = opcion === "45_45" ? 45 : 10;
  const diasDespues = opcion === "45_45" ? 45 : 80;
  const inicio = sumarDias(input.fpp, -diasAntes);
  // Los días "posteriores" corren desde el día del parto inclusive → fin = FPP + (N-1).
  // Así el descanso suma exactamente 90 días corridos (45 previos sin el día del parto + N).
  const fin = sumarDias(input.fpp, diasDespues - 1);
  return {
    inicio,
    fin,
    diasTotales: diffDias(inicio, fin) + 1,
    opcion,
    fpp: input.fpp,
    avisoExcedenciaLimite: sumarDias(fin, -2),
    excedenciaMinima: sumarMeses(fin, 3),
    excedenciaMaxima: sumarMeses(fin, 6),
    presuncionArt178: presuncionArt178(input.fpp),
    citas: [CITAS_LEGALES.art177, CITAS_LEGALES.art178, CITAS_LEGALES.art183],
  };
}

/** Nacimiento pretérmino: lo no gozado antes del parto se acumula al posterior (art. 177).
 * Modelo legal: el período posterior corre SIEMPRE desde el día del nacimiento inclusive
 * (no se puede trabajar tras el parto), con los días previos no gozados sumados al final.
 * El total gozado es siempre 90 días. */
export function calcularLicenciaPrematuro(input: {
  fpp: string;
  fechaNacimiento: string;
  opcion?: OpcionLicencia;
}): Licencia & { gozadosAntesDelParto: number; acumuladoAlPosterior: number } {
  const base = calcularLicencia(input);
  const nac = input.fechaNacimiento;
  if (diffDias(nac, input.fpp) < 0) {
    throw new Error("La fecha de nacimiento es posterior a la FPP: usá la licencia estándar.");
  }
  const opcion = input.opcion ?? "45_45";
  const programadosAntes = opcion === "10_80" ? 10 : 45;
  const diasDespues = opcion === "10_80" ? 80 : 45;
  const gozados = Math.min(Math.max(0, diffDias(base.inicio, nac)), programadosAntes);
  const acumulado = programadosAntes - gozados;
  const fin = sumarDias(nac, diasDespues + acumulado - 1);
  return {
    ...base,
    inicio: base.inicio,
    fin,
    diasTotales: gozados + diasDespues + acumulado,
    gozadosAntesDelParto: gozados,
    acumuladoAlPosterior: acumulado,
    avisoExcedenciaLimite: sumarDias(fin, -2),
    excedenciaMinima: sumarMeses(fin, 3),
    excedenciaMaxima: sumarMeses(fin, 6),
  };
}

/** Presunción art. 178: 7,5 meses antes y después del parto. */
function presuncionArt178(fpp: string): { desde: string; hasta: string } {
  const sieteYMedioAntes = sumarDias(sumarMeses(fpp, -7), -15);
  const sieteYMedioDespues = sumarDias(sumarMeses(fpp, 7), 15);
  return { desde: sieteYMedioAntes, hasta: sieteYMedioDespues };
}
