"use client";

import { useState } from "react";
import Link from "next/link";
import { estadoGestacional, hitosRestantes, type EstadoGestacional } from "@/lib/gestacion";
import { fechaLarga, hoyISO } from "@/lib/fechas";

type Modo = "lmp" | "fiv";

export default function CalculadoraEmbarazoCliente() {
  const [modo, setModo] = useState<Modo>("lmp");
  const [lmp, setLmp] = useState("");
  const [ciclo, setCiclo] = useState(28);
  const [transferencia, setTransferencia] = useState("");
  const [diaFiv, setDiaFiv] = useState<3 | 5>(5);
  const [resultado, setResultado] = useState<EstadoGestacional | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultado(null);
    try {
      const datos =
        modo === "fiv"
          ? { fivTransferencia: transferencia, fivDia: diaFiv, hoy: hoyISO() }
          : { lmp, ciclo, hoy: hoyISO() };
      setResultado(estadoGestacional(datos));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revisá los datos ingresados.");
    }
  }

  const hitos = resultado ? hitosRestantes(resultado.semanas) : [];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Calculadora de embarazo</h1>
      <p className="mb-6 max-w-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
        Ingresá la fecha de tu última menstruación (el primer día del sangrado) o los datos de tu
        transferencia de FIV, y te decimos cuántas semanas tenés, cuándo es la fecha probable de
        parto y qué hitos vienen.
      </p>

      <form onSubmit={calcular} className="card mb-6">
        <fieldset className="mb-4">
          <legend className="mb-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            ¿Cómo querés calcularlo?
          </legend>
          <div className="flex gap-2" role="group" aria-label="Modo de cálculo">
            <button
              type="button"
              onClick={() => setModo("lmp")}
              aria-pressed={modo === "lmp"}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                modo === "lmp"
                  ? "bg-rose-700 text-white"
                  : "border border-neutral-300 hover:border-rose-500 dark:border-neutral-700"
              }`}
            >
              Última menstruación
            </button>
            <button
              type="button"
              onClick={() => setModo("fiv")}
              aria-pressed={modo === "fiv"}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                modo === "fiv"
                  ? "bg-rose-700 text-white"
                  : "border border-neutral-300 hover:border-rose-500 dark:border-neutral-700"
              }`}
            >
              FIV (transferencia)
            </button>
          </div>
        </fieldset>

        {modo === "lmp" ? (
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lmp">Primer día de tu última menstruación</label>
              <input
                id="lmp"
                type="date"
                required
                value={lmp}
                max={hoyISO()}
                onChange={(e) => setLmp(e.target.value)}
                className="input mt-1"
              />
            </div>
            <div>
              <label htmlFor="ciclo">Duración habitual de tu ciclo</label>
              <select
                id="ciclo"
                value={ciclo}
                onChange={(e) => setCiclo(Number(e.target.value))}
                className="input mt-1"
              >
                {Array.from({ length: 26 }, (_, i) => i + 20).map((c) => (
                  <option key={c} value={c}>
                    {c} días{c === 28 ? " (más común)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="transfer">Fecha de la transferencia del embrión</label>
              <input
                id="transfer"
                type="date"
                required
                value={transferencia}
                onChange={(e) => setTransferencia(e.target.value)}
                className="input mt-1"
              />
            </div>
            <div>
              <label htmlFor="diafiv">Día del embrión transferido</label>
              <select
                id="diafiv"
                value={diaFiv}
                onChange={(e) => setDiaFiv(Number(e.target.value) as 3 | 5)}
                className="input mt-1"
              >
                <option value={5}>Día 5 (blastocisto)</option>
                <option value={3}>Día 3</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" className="btn">
          Calcular
        </button>
      </form>

      {error && (
        <div className="warning mb-6" role="alert">
          {error}
        </div>
      )}

      {resultado && (
        <section aria-live="polite" className="mb-8">
          <div className="verdict mb-4">
            <p className="caption mb-1">Hoy estás en la</p>
            <p className="numero-resultado">
              semana {resultado.semanas}
              <span className="text-2xl font-normal sm:text-3xl"> y {resultado.diasDeSemana} días</span>
            </p>
            <p className="mb-3 mt-2">
              <span className="badge-trimestre">
                {resultado.trimestre === 1
                  ? "1er trimestre"
                  : resultado.trimestre === 2
                    ? "2do trimestre"
                    : "3er trimestre"}
              </span>
            </p>
            <div
              className="mb-1 h-2 overflow-hidden rounded-full bg-rose-200 dark:bg-rose-900"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-rose-700 dark:bg-rose-300"
                style={{ width: `${resultado.progresoPct}%` }}
              />
            </div>
            <p className="caption">
              {resultado.progresoPct}% del embarazo · faltan {resultado.diasParaFpp} días para la
              fecha probable de parto
            </p>
          </div>

          <div className="card mb-4">
            <h2 className="mb-2 text-lg font-semibold">Fecha probable de parto</h2>
            <p className="text-xl">
              <strong>{fechaLarga(resultado.fpp)}</strong>
            </p>
            <p className="caption mt-1">
              La mayoría de los bebés nace entre 3 semanas antes y 2 semanas después de esa fecha
              (37 a 42 semanas). Es un cálculo orientativo: tu médico puede ajustarlo con la
              ecografía.
            </p>
          </div>

          {hitos.length > 0 && (
            <div className="card mb-4">
              <h2 className="mb-3 text-lg font-semibold">Hitos que vienen</h2>
              <ol className="relative ml-2 border-l-2 border-rose-200 dark:border-rose-900">
                {hitos.map((h) => (
                  <li key={h.semana} className="mb-4 ml-4">
                    <span
                      className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-rose-700 bg-neutral-50 dark:border-rose-300 dark:bg-neutral-950"
                      aria-hidden
                    />
                    <h3 className="font-semibold">
                      Semana {h.semana}: {h.titulo}
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">{h.detalle}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="warning mb-4">
            Herramienta informativa: no reemplaza tu control prenatal ni la opinión de tu médico.
          </div>

          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            ¿Querés saber las fechas de tu licencia por maternidad?{" "}
            <Link href="/licencia-por-maternidad/" className="acento underline">
              Calculala acá
            </Link>{" "}
            con tu fecha probable de parto ({fechaLarga(resultado.fpp)}).
          </p>
        </section>
      )}

      <section className="card">
        <h2 className="mb-2 text-lg font-semibold">¿Cómo se calcula?</h2>
        <p className="mb-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
          El método estándar (regla de Naegele) cuenta 280 días desde el primer día de la última
          menstruación, asumiendo un ciclo de 28 días. Si tu ciclo es más largo o más corto, la
          fecha se ajusta: 280 días más (o menos) la diferencia. En embarazos por FIV el cálculo
          es más preciso: 261 días desde la transferencia de un embrión de día 5, o 263 días si
          fue de día 3.
        </p>
        <p className="caption">
          Fuente: regla de Naegele, utilizada por la obstetricia desde hace más de 180 años. El
          control prenatal argentino sigue las recomendaciones del Ministerio de Salud.
        </p>
      </section>
    </div>
  );
}
