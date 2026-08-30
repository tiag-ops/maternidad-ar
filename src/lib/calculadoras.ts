export interface Calculadora {
  slug: string;
  titulo: string;
  descripcion: string;
  keyword: string;
  categoria: "embarazo" | "derechos" | "asignaciones";
  icono: string;
}

/** Registro central: la home y el sitemap se generan de acá. */
export const calculadoras: Calculadora[] = [
  {
    slug: "calculadora-de-embarazo",
    titulo: "Calculadora de embarazo",
    descripcion:
      "Cuantas semanas tenés, la fecha probable de parto y los hitos que vienen. Por última menstruación, duración del ciclo o FIV.",
    keyword: "calculadora de embarazo",
    categoria: "embarazo",
    icono: "🤰",
  },
  {
    slug: "licencia-por-maternidad",
    titulo: "Licencia por maternidad",
    descripcion:
      "Las fechas exactas de tu licencia según la ley argentina: 45+45 o 10+80, aviso de excedencia y regreso al trabajo.",
    keyword: "licencia por maternidad",
    categoria: "derechos",
    icono: "📋",
  },
  {
    slug: "asignacion-por-embarazo",
    titulo: "Asignación por embarazo",
    descripcion:
      "Cuánto cobrás según tu situación: AUE, prenatal o maternidad. Montos oficiales de ANSES con fecha de vigencia.",
    keyword: "asignación por embarazo",
    categoria: "asignaciones",
    icono: "💰",
  },
];

export const CATEGORIAS: Record<Calculadora["categoria"], string> = {
  embarazo: "Embarazo",
  derechos: "Derechos laborales",
  asignaciones: "Asignaciones",
};
