import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { todasLasGuias, getGuia } from "@/lib/articulos";

const guias = todasLasGuias();

describe("catálogo de guías", () => {
  it("hay 10 guías", () => {
    expect(guias).toHaveLength(10);
  });
  it("slugs únicos", () => {
    const slugs = guias.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("getGuia resuelve y devuelve undefined para slugs desconocidos", () => {
    expect(getGuia("licencia-por-maternidad-cuantos-dias")?.titulo).toContain("cuántos días");
    expect(getGuia("no-existe")).toBeUndefined();
  });
});

describe("estructura mínima de cada guía", () => {
  it.each(guias.map((g) => g.slug))("%s: bloques, faqs y relacionadas completos", (slug) => {
    const g = getGuia(slug)!;
    expect(g.titulo.length).toBeGreaterThan(10);
    expect(g.descripcion.length).toBeGreaterThan(50);
    expect(g.descripcion.length).toBeLessThanOrEqual(200);
    expect(g.bloques.length).toBeGreaterThanOrEqual(3);
    expect(g.faqs.length).toBeGreaterThanOrEqual(2);
    expect(g.relacionadas.length).toBeGreaterThanOrEqual(1);
    // toda CTA apunta a una ruta interna que existe
    for (const b of g.bloques) {
      if (b.tipo === "calc") expect(b.href).toMatch(/^\/(guia\/)?[a-z0-9-]+\/$/);
    }
  });
});

describe("regla de oro: cero montos hardcodeados", () => {
  /** El chequeo es sobre el CÓDIGO FUENTE: un monto literal ("$150.848") en un string
   * es una violación; una interpolación ${ars(...)} es la vía correcta. */
  const RE_MONTO_LITERAL = /\$\s?\d/;

  function fuentesDeGuias(): { archivo: string; contenido: string }[] {
    const dir = path.resolve(__dirname, "../articulos");
    return ["guias-basicas.ts", "guias-avanzadas.ts", "guias-proyecto.ts"].map((archivo) => ({
      archivo,
      contenido: fs.readFileSync(path.join(dir, archivo), "utf-8"),
    }));
  }

  it("ningún archivo de guías contiene un monto en pesos escrito a mano", () => {
    const infracciones: string[] = [];
    for (const { archivo, contenido } of fuentesDeGuias()) {
      const lineas = contenido.split("\n");
      for (let i = 0; i < lineas.length; i++) {
        if (RE_MONTO_LITERAL.test(lineas[i])) {
          infracciones.push(`${archivo}:${i + 1}: ${lineas[i].trim().slice(0, 80)}`);
        }
      }
    }
    expect(infracciones).toEqual([]);
  });

  it("las tablas con montos citan la fuente/vigencia en el caption", () => {
    for (const g of guias) {
      for (const b of g.bloques) {
        if (b.tipo === "tabla" && b.filas.some((f) => f.some((c) => c.includes("$")))) {
          expect(b.caption, g.slug).toBeDefined();
          expect(b.caption!.toLowerCase()).toMatch(/anses|art\.|ley 20\.744|oficial/);
        }
      }
    }
  });
});
