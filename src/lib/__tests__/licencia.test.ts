import { describe, expect, it } from "vitest";
import { calcularLicencia, calcularLicenciaPrematuro } from "../licencia";

describe("calcularLicencia 45/45 (default)", () => {
  const l = calcularLicencia({ fpp: "2026-10-08" });
  it("inicio 24/08/2026, fin 21/11/2026, 90 días corridos", () => {
    expect(l.inicio).toBe("2026-08-24");
    expect(l.fin).toBe("2026-11-21");
    expect(l.diasTotales).toBe(90);
    expect(l.opcion).toBe("45_45");
  });
  it("último día para avisar excedencia: 19/11/2026 (48 h antes)", () => {
    expect(l.avisoExcedenciaLimite).toBe("2026-11-19");
  });
  it("excedencia: entre 21/02/2027 y 21/05/2027", () => {
    expect(l.excedenciaMinima).toBe("2027-02-21");
    expect(l.excedenciaMaxima).toBe("2027-05-21");
  });
  it("presunción art. 178: desde 21/02/2026 hasta 23/05/2027", () => {
    expect(l.presuncionArt178.desde).toBe("2026-02-21");
    expect(l.presuncionArt178.hasta).toBe("2027-05-23");
  });
  it("cita la ley con texto vigente", () => {
    expect(l.citas[0]).toContain("Ley 20.744");
    expect(l.citas[0]).toContain("27.742");
  });
});

describe("calcularLicencia opción 10/80", () => {
  it("inicio 28/09/2026, fin 26/12/2026", () => {
    const l = calcularLicencia({ fpp: "2026-10-08", opcion: "10_80" });
    expect(l.inicio).toBe("2026-09-28");
    expect(l.fin).toBe("2026-12-26");
    expect(l.diasTotales).toBe(90);
  });
});

describe("calcularLicenciaPrematuro", () => {
  it("nace 27 días tras el inicio: goza 27 antes, acumula 18, fin igual al estándar", () => {
    const l = calcularLicenciaPrematuro({
      fpp: "2026-10-08",
      fechaNacimiento: "2026-09-20",
    });
    expect(l.gozadosAntesDelParto).toBe(27);
    expect(l.acumuladoAlPosterior).toBe(18);
    expect(l.fin).toBe("2026-11-21");
    expect(l.diasTotales).toBe(90);
  });
  it("con opción 10/80 y nacimiento antes del inicio: acumula los 10", () => {
    const l = calcularLicenciaPrematuro({
      fpp: "2026-10-08",
      fechaNacimiento: "2026-09-15",
      opcion: "10_80",
    });
    expect(l.gozadosAntesDelParto).toBe(0);
    expect(l.acumuladoAlPosterior).toBe(10);
    expect(l.fin).toBe("2026-12-13"); // 15/09 + 89 días = 90 corridos desde el nacimiento
  });
  it("rechaza nacimiento posterior a la FPP (usar licencia estándar)", () => {
    expect(() =>
      calcularLicenciaPrematuro({ fpp: "2026-10-08", fechaNacimiento: "2026-10-09" }),
    ).toThrow(/estándar/);
  });
});
