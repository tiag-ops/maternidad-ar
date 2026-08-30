/** Utilidades de formato es-AR. */

const fmtARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtARS0 = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** $150.848,00 (con decimales — los montos ANSES traen centavos). */
export function formatARS(n: number): string {
  return fmtARS.format(n);
}

/** $150.848 (sin decimales, para montos redondos). */
export function formatARS0(n: number): string {
  return fmtARS0.format(n);
}

/** 1.234,56 con coma decimal. */
export function formatNum(n: number): string {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);
}
