import { describe, expect, it } from "vitest";
import {
  montoAue,
  montoPrenatal,
  montoNacimiento,
  asignacionesCorrespondientes,
  vigenciaActualizada,
  fuenteDatos,
  TOPE_IGF,
} from "../asignaciones";

describe("montos oficiales (fixtures verificados contra ANSES, agosto 2026)", () => {
  it("AUE: 80% = $120.678,40 y total mes = $150.848", () => {
    const a = montoAue();
    expect(a.pagoMensual80).toBe(120678.4);
    expect(a.complemento20).toBe(30169.6);
    expect(a.totalMes).toBe(150848.0);
  });
  it("AUE zona austral: total $196.103", () => {
    expect(montoAue("austral").totalMes).toBe(196103.0);
  });
  it("nacimiento: $87.926 con condición de tope", () => {
    const n = montoNacimiento();
    expect(n.monto).toBe(87926);
    expect(n.condicion).toContain("6.184.406");
  });
});

describe("montoPrenatal por IGF (zona general)", () => {
  it("tramo 1: IGF $1.000.000 → $75.433", () => {
    expect(montoPrenatal(1_000_000)?.monto).toBe(75433);
  });
  it("tramo 2: IGF $1.500.000 → $50.884", () => {
    expect(montoPrenatal(1_500_000)?.monto).toBe(50884);
  });
  it("tramo 3: IGF $1.800.000 → $30.777", () => {
    expect(montoPrenatal(1_800_000)?.monto).toBe(30777);
  });
  it("tramo 4: IGF $3.000.000 → $15.881", () => {
    expect(montoPrenatal(3_000_000)?.monto).toBe(15881);
  });
  it("borde exacto de tramo: IGF $1.167.863 cae en tramo 1", () => {
    expect(montoPrenatal(1_167_863)?.monto).toBe(75433);
  });
  it("supera el tope de IGF → null", () => {
    expect(montoPrenatal(6_500_000)).toBeNull();
  });
  it("integrante que supera el tope individual excluye al grupo → null", () => {
    expect(montoPrenatal(1_000_000, 3_500_000)).toBeNull();
  });
  it("integrante por debajo del tope no excluye", () => {
    expect(montoPrenatal(1_000_000, 3_000_000)?.monto).toBe(75433);
  });
});

describe("asignacionesCorrespondientes", () => {
  it("dependencia: prenatal + maternidad + nacimiento", () => {
    const claves = asignacionesCorrespondientes("dependencia").map((a) => a.clave);
    expect(claves).toEqual(["prenatal", "maternidad", "nacimiento"]);
  });
  it("proteccion_social: AUE + pago único", () => {
    const claves = asignacionesCorrespondientes("proteccion_social").map((a) => a.clave);
    expect(claves).toEqual(["aue", "nacimiento"]);
  });
  it("monotributo: prenatal + maternidad + nacimiento", () => {
    const claves = asignacionesCorrespondientes("monotributo").map((a) => a.clave);
    expect(claves).toEqual(["prenatal", "maternidad", "nacimiento"]);
  });
});

describe("vigencia y fuente", () => {
  it("vigenciaDesde es 2026-08-01 (agosto 2026)", () => {
    expect(fuenteDatos().vigenciaDesde).toBe("2026-08-01");
    expect(fuenteDatos().fuente).toBe("ANSES");
  });
  it("drift detector: 45 días → ok, 61 días → desactualizado", () => {
    expect(vigenciaActualizada("2026-09-15")).toBe(true);
    expect(vigenciaActualizada("2026-10-01")).toBe(false);
  });
  it("tope IGF exportado", () => {
    expect(TOPE_IGF).toBe(6_184_406);
  });
});
