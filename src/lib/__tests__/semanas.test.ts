import { describe, expect, it } from "vitest";
import { getSemana, todasLasSemanas, trimestreDeSemana, TOTAL_SEMANAS } from "@/lib/semanas";

const semanas = todasLasSemanas();

describe("dataset semana-a-semana", () => {
  it("tiene exactamente 40 semanas", () => {
    expect(semanas).toHaveLength(TOTAL_SEMANAS);
  });
  it("numeración continua 1..40 sin huecos ni duplicados", () => {
    const ns = semanas.map((s) => s.n).sort((a, b) => a - b);
    expect(ns).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });
  it("cada semana tiene contenido completo (nada vacío ni placeholder)", () => {
    for (const s of semanas) {
      // Semanas 1-3: todavía no hay embrión medible — "—" es el valor correcto.
      if (s.n >= 4) {
        expect(s.tamano.length, `semana ${s.n} tamano`).toBeGreaterThan(2);
      } else {
        expect(s.tamano, `semana ${s.n} tamano pre-implantación`).toBe("—");
        expect(s.medidaCm, `semana ${s.n} medida`).toBeNull();
      }
      expect(s.desarrollo.length, `semana ${s.n} desarrollo`).toBeGreaterThan(60);
      expect(s.control.length, `semana ${s.n} control`).toBeGreaterThan(40);
    }
  });
  it("la medida crece monótonamente (sin retrocesos)", () => {
    let previa = 0;
    for (const s of semanas) {
      if (s.medidaCm !== null) {
        expect(s.medidaCm, `semana ${s.n}`).toBeGreaterThanOrEqual(previa);
        previa = s.medidaCm;
      }
    }
  });
  it("los tamaños de comparación no se repiten", () => {
    const tamanos = semanas.filter((s) => s.n >= 4).map((s) => s.tamano);
    expect(new Set(tamanos).size).toBe(tamanos.length);
  });
  it("semana 40 menciona la FPP y el término", () => {
    expect(getSemana(40)?.desarrollo).toMatch(/FPP|término/);
  });
});

describe("trimestres", () => {
  it("bordes: 13 T1, 14 T2, 27 T2, 28 T3", () => {
    expect(trimestreDeSemana(13)).toBe(1);
    expect(trimestreDeSemana(14)).toBe(2);
    expect(trimestreDeSemana(27)).toBe(2);
    expect(trimestreDeSemana(28)).toBe(3);
  });
  it("fuera de rango lanza/undefined", () => {
    expect(getSemana(0)).toBeUndefined();
    expect(getSemana(41)).toBeUndefined();
  });
});
