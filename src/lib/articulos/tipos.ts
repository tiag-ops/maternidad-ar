/** Tipos del sistema de guías (build-time, tablas vivas desde src/data). */

export type Bloque =
  | { tipo: "p"; texto: string }
  | { tipo: "h2"; texto: string }
  | { tipo: "ul"; items: string[] }
  | { tipo: "tabla"; headers: string[]; filas: string[][]; caption?: string }
  | { tipo: "calc"; href: string; texto: string }; // CTA a calculadora

export interface Faq {
  pregunta: string;
  respuesta: string;
}

export interface Guia {
  slug: string;
  titulo: string;
  descripcion: string; // meta description ~150 chars
  bloques: Bloque[];
  faqs: Faq[];
  relacionadas: { titulo: string; href: string }[]; // calculadoras/guías
}
