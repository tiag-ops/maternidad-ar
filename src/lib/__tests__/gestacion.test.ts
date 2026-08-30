import { describe, expect, it } from "vitest";
import {
  calcularFpp,
  estadoGestacional,
  ventanaFertil,
  hitosRestantes,
  HITOS,
} from "../gestacion";

describe("calcularFpp", () => {
  it("Naegele estándar: LMP 2026-01-01 → FPP 2026-10-08", () => {
    expect(calcularFpp({ lmp: "2026-01-01" })).toBe("2026-10-08");
  });
  it("ciclo 35 días suma 7 días a la FPP", () => {
    expect(calcularFpp({ lmp: "2026-01-01", ciclo: 35 })).toBe("2026-10-15");
  });
  it("ciclo 24 días resta 4 días", () => {
    expect(calcularFpp({ lmp: "2026-01-01", ciclo: 24 })).toBe("2026-10-04");
  });
  it("FIV día 5 (blastocisto): transferencia 2026-01-05 → FPP 2026-09-23 (+261)", () => {
    expect(calcularFpp({ fivTransferencia: "2026-01-05", fivDia: 5 })).toBe("2026-09-23");
  });
  it("FIV día 3: transferencia 2026-01-05 → FPP 2026-09-25 (+263)", () => {
    expect(calcularFpp({ fivTransferencia: "2026-01-05", fivDia: 3 })).toBe("2026-09-25");
  });
  it("rechaza ciclo fuera de 20–45", () => {
    expect(() => calcularFpp({ lmp: "2026-01-01", ciclo: 15 })).toThrow(/20 y 45/);
  });
  it("sin datos lanza error claro", () => {
    expect(() => calcularFpp({})).toThrow(/última menstruación/);
  });
  it("FIV sin día de embrión lanza error", () => {
    expect(() => calcularFpp({ fivTransferencia: "2026-01-05" })).toThrow(/día del embrión/);
  });
});

describe("estadoGestacional", () => {
  const base = { lmp: "2026-01-01", hoy: "2026-03-15" };
  it("canario: 10 semanas y 3 días, T1, FPP 08/10, progreso 26,1%", () => {
    const e = estadoGestacional(base);
    expect(e.semanas).toBe(10);
    expect(e.diasDeSemana).toBe(3);
    expect(e.trimestre).toBe(1);
    expect(e.fpp).toBe("2026-10-08");
    expect(e.lmpEquivalente).toBe("2026-01-01");
    expect(e.diasGestacionales).toBe(73);
    expect(e.progresoPct).toBe(26.1);
    expect(e.diasParaFpp).toBe(207);
    expect(e.postTermino).toBe(false);
  });
  it("bordes de trimestre: día 97 T1, 98 T2, 195 T2, 196 T3", () => {
    expect(estadoGestacional({ ...base, hoy: "2026-04-08" }).trimestre).toBe(1);
    expect(estadoGestacional({ ...base, hoy: "2026-04-09" }).trimestre).toBe(2);
    expect(estadoGestacional({ ...base, hoy: "2026-07-15" }).trimestre).toBe(2);
    expect(estadoGestacional({ ...base, hoy: "2026-07-16" }).trimestre).toBe(3);
  });
  it("postérmino a las 42 semanas y 1 día", () => {
    const e = estadoGestacional({ ...base, hoy: "2026-10-23" });
    expect(e.postTermino).toBe(true);
    expect(e.semanas).toBe(42);
    expect(e.diasDeSemana).toBe(1);
  });
  it("rechaza fecha futura (LMP después de hoy)", () => {
    expect(() => estadoGestacional({ ...base, hoy: "2025-12-01" })).toThrow(/posterior/);
  });
  it("funciona con FIV: EG derivada de la transferencia", () => {
    const e = estadoGestacional({
      fivTransferencia: "2026-01-05",
      fivDia: 5,
      hoy: "2026-01-19",
    });
    // Transferencia D5 = día 19 de gestación → 14 días después: día 33 = 4w5d
    expect(e.semanas).toBe(4);
    expect(e.diasDeSemana).toBe(5);
  });
});

describe("ventanaFertil", () => {
  it("ciclo 28: ovulación día 15, ventana fértil −5 a +1", () => {
    expect(ventanaFertil({ lmp: "2026-01-01" })).toEqual({
      ovulacion: "2026-01-15",
      inicio: "2026-01-10",
      fin: "2026-01-16",
    });
  });
  it("ciclo 35: ovulación día 22", () => {
    expect(ventanaFertil({ lmp: "2026-01-01", ciclo: 35 }).ovulacion).toBe("2026-01-22");
  });
  it("rechaza ciclo inválido", () => {
    expect(() => ventanaFertil({ lmp: "2026-01-01", ciclo: 50 })).toThrow(/20 y 45/);
  });
});

describe("hitos", () => {
  it("hay 5 hitos definidos", () => {
    expect(HITOS).toHaveLength(5);
  });
  it("hitosRestantes(10) → los 5", () => {
    expect(hitosRestantes(10)).toHaveLength(5);
  });
  it("hitosRestantes(25) → semana 28 y 37", () => {
    expect(hitosRestantes(25).map((h) => h.semana)).toEqual([28, 37]);
  });
  it("hitosRestantes(38) → ninguno", () => {
    expect(hitosRestantes(38)).toHaveLength(0);
  });
});
