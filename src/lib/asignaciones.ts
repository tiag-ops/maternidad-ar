/** Motor de asignaciones ANSES — funciones PURAS.
 * Los montos viven en src/data/anses-2026-08.json (fuente oficial, verificado 2026-08-29).
 * Regla de oro: si el dato no está en el JSON, no se muestra. */

import datos from "@/data/anses-2026-08.json";
import { diffDias } from "./fechas";

export interface MontoPartes {
  pagoMensual80: number;
  complemento20: number;
  totalMes: number;
}
export interface MontoUniversal extends MontoPartes {
  nombre: string;
  zonaAustral: MontoPartes;
}
interface TramoPrenatal {
  rango: string;
  desde: number;
  hasta: number;
  valores: { general: number; zona1: number; zona2: number; zona3: number; zona4: number };
}
interface DatosAnses {
  vigenciaDesde: string;
  actualizadoEl: string;
  fuente: string;
  urlFuente: string;
  aue: MontoUniversal;
  auh: MontoUniversal & { conDiscapacidad: MontoUniversal };
  nacimiento: { nombre: string; monto: number; condicion: string };
  prenatal: { nombre: string; tramos: TramoPrenatal[] };
  topes: { igfMaximo: number; integranteMaximo: number; nota: string };
  urlFuenteUniversal?: string;
}

const d = datos as unknown as DatosAnses;

export type Zona = "general" | "austral";

export function montoAue(zona: Zona = "general"): MontoPartes & { nombre: string } {
  return zona === "austral" ? { ...d.aue.zonaAustral, nombre: d.aue.nombre } : d.aue;
}

export function montoAUH(zona: Zona = "general"): MontoPartes & { nombre: string } {
  return zona === "austral" ? { ...d.auh.zonaAustral, nombre: d.auh.nombre } : d.auh;
}

export function montoAUHConDiscapacidad(zona: Zona = "general"): MontoPartes {
  return zona === "austral" ? d.auh.conDiscapacidad.zonaAustral : d.auh.conDiscapacidad;
}

/** Prenatal según IGF mensual. Null si el grupo queda excluido por topes.
 * maxIntegrante: si algún integrante supera el tope individual, el grupo queda excluido. */
export function montoPrenatal(
  igf: number,
  maxIntegrante?: number,
): { monto: number; tramo: string } | null {
  if (maxIntegrante !== undefined && maxIntegrante > d.topes.integranteMaximo) return null;
  if (igf > d.topes.igfMaximo) return null;
  const tramo = d.prenatal.tramos.find((t) => igf <= t.hasta);
  if (!tramo) return null;
  return { monto: tramo.valores.general, tramo: tramo.rango };
}

export function montoNacimiento(): { monto: number; condicion: string } {
  return { monto: d.nacimiento.monto, condicion: d.nacimiento.condicion };
}

export type Situacion = "proteccion_social" | "dependencia" | "monotributo";

export interface AsignacionInfo {
  clave: string;
  nombre: string;
  tipo: "mensual" | "unica" | "durante_licencia";
  detalle: string;
}

/** Qué le corresponde según su situación laboral. */
export function asignacionesCorrespondientes(s: Situacion): AsignacionInfo[] {
  switch (s) {
    case "proteccion_social":
      return [
        {
          clave: "aue",
          nombre: d.aue.nombre,
          tipo: "mensual",
          detalle: "80% mensual durante el embarazo + 20% acumulado que se cobra tras acreditar el nacimiento. Requiere embarazo de 12+ semanas, inscripción en Sumar+ y cumplir los controles prenatales.",
        },
        {
          clave: "nacimiento",
          nombre: "Pago único por nacimiento (Protección Social)",
          tipo: "unica",
          detalle: "Se cobra una vez por hijo al acreditar el nacimiento.",
        },
      ];
    case "dependencia":
      return [
        {
          clave: "prenatal",
          nombre: d.prenatal.nombre,
          tipo: "mensual",
          detalle: "Mensual según el Ingreso del Grupo Familiar (IGF). La paga el empleador y se recupera del Fondo de Compensación de ANSES.",
        },
        {
          clave: "maternidad",
          nombre: "Asignación por Maternidad",
          tipo: "durante_licencia",
          detalle: "100% del sueldo durante la licencia por maternidad (90 días), pagado por ANSES. Sin tope de IGF.",
        },
        {
          clave: "nacimiento",
          nombre: "Asignación por Nacimiento (pago único)",
          tipo: "unica",
          detalle: "Pago único al acreditar el nacimiento, sujeto al tope de IGF.",
        },
      ];
    case "monotributo":
      return [
        {
          clave: "prenatal",
          nombre: d.prenatal.nombre,
          tipo: "mensual",
          detalle: "Para monotributistas, según el IGF (rentas de referencia del monotributo).",
        },
        {
          clave: "maternidad",
          nombre: "Asignación por Maternidad",
          tipo: "durante_licencia",
          detalle: "Equivale a las rentas de referencia del monotributo durante la licencia.",
        },
        {
          clave: "nacimiento",
          nombre: "Asignación por Nacimiento (pago único)",
          tipo: "unica",
          detalle: "Pago único al acreditar el nacimiento, sujeto al tope de IGF.",
        },
      ];
  }
}

/** Metadatos de fuente para mostrar en el sitio. */
export function fuenteDatos(): {
  fuente: string;
  url: string;
  urlUniversal?: string;
  vigenciaDesde: string;
  actualizadoEl: string;
} {
  return {
    fuente: d.fuente,
    url: d.urlFuente,
    urlUniversal: d.urlFuenteUniversal,
    vigenciaDesde: d.vigenciaDesde,
    actualizadoEl: d.actualizadoEl,
  };
}

/** Drift detector: false si el JSON corre más de maxDias días sin actualización. */
export function vigenciaActualizada(hoy: string, maxDias = 45): boolean {
  return diffDias(d.vigenciaDesde, hoy) <= maxDias;
}

export const TOPE_IGF = d.topes.igfMaximo;
export const TOPE_INTEGRANTE = d.topes.integranteMaximo;
export const NOTA_TOPES = d.topes.nota;
