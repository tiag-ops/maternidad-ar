/** Utilidades de fecha SOLO con aritmética UTC.
 * Regla de oro (learned the hard way): `new Date("2026-08-10")` parsea como
 * mediodía UTC normalizado acá; NUNCA usar setHours() local (bug UTC-3). */

const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Parsea "YYYY-MM-DD" a Date anclada al mediodía UTC. */
export function parsearFecha(iso: string): Date {
  if (!RE_ISO.test(iso)) throw new Error(`Fecha inválida: "${iso}" (se espera YYYY-MM-DD)`);
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: "${iso}"`);
  return d;
}

/** Date → "YYYY-MM-DD" (UTC). */
export function aISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Suma días a una fecha ISO. */
export function sumarDias(iso: string, dias: number): string {
  const d = parsearFecha(iso);
  d.setUTCDate(d.getUTCDate() + dias);
  return aISO(d);
}

/** Días de fecha a fecha (b inclusive-exclusivo, maneja DST por anclaje UTC). */
export function diffDias(desde: string, hasta: string): number {
  return Math.round((parsearFecha(hasta).getTime() - parsearFecha(desde).getTime()) / 86_400_000);
}

/** Suma meses calendario (clamp al último día del mes destino: 31/5 → 30/6).
 * Matemática 0-based pura, sin mutar el Date (evita el overflow de 29 feb). */
export function sumarMeses(iso: string, meses: number): string {
  const d = parsearFecha(iso);
  const totalMes0 = d.getUTCMonth() + meses;
  const y = d.getUTCFullYear() + Math.floor(totalMes0 / 12);
  const mm = ((totalMes0 % 12) + 12) % 12;
  const ultimoDia = new Date(Date.UTC(y, mm + 1, 0)).getUTCDate();
  const dia = Math.min(d.getUTCDate(), ultimoDia);
  return `${y}-${String(mm + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** Fecha local de "hoy" → ISO (para el cliente). */
export function hoyISO(): string {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(
    ahora.getDate(),
  ).padStart(2, "0")}`;
}

/** "2026-10-08" → "8 de octubre de 2026" (sin ambigüedad, es-AR). */
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;

export function fechaLarga(iso: string): string {
  const d = parsearFecha(iso);
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}
