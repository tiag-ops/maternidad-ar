"use client";

import { useState } from "react";
import Link from "@/components/link";
import {
  calcularLicencia,
  type Licencia,
  type OpcionLicencia,
} from "@/lib/licencia";
import { fechaLarga } from "@/lib/fechas";

export default function LicenciaCliente() {
  const [fpp, setFpp] = useState("");
  const [opcion, setOpcion] = useState<OpcionLicencia>("45_45");
  const [resultado, setResultado] = useState<Licencia | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResultado(null);
    try {
      setResultado(calcularLicencia({ fpp, opcion }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revisá la fecha ingresada.");
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Licencia por maternidad</h1>
      <p className="mb-6 max-w-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
        La ley argentina te da <strong>90 días de licencia paga</strong> (art. 177 de la Ley
        20.744): 45 antes del parto y 45 después, o si preferís, solo 10 antes y 80 después.
        Ingresá tu fecha probable de parto y te armamos el calendario completo.
      </p>

      <form onSubmit={calcular} className="card mb-6">
        <div className="mb-4">
          <label htmlFor="fpp">Fecha probable de parto (FPP)</label>
          <input
            id="fpp"
            type="date"
            required
            value={fpp}
            onChange={(e) => setFpp(e.target.value)}
            className="input mt-1"
          />
          <p className="caption mt-1">
            Es la fecha que figura en tu certificado médico. Si no la tenés, calculala primero con{" "}
            <Link href="/calculadora-de-embarazo/" className="acento underline">
              la calculadora de embarazo
            </Link>
            .
          </p>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
            ¿Cómo preferís repartir los 90 días?
          </legend>
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-neutral-200 p-3 hover:border-rose-300 dark:border-neutral-700 dark:hover:border-rose-800">
              <input
                type="radio"
                name="opcion"
                checked={opcion === "45_45"}
                onChange={() => setOpcion("45_45")}
                className="mt-1"
              />
              <span>
                <strong>45 antes y 45 después</strong> — la opción más común.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-neutral-200 p-3 hover:border-rose-300 dark:border-neutral-700 dark:hover:border-rose-800">
              <input
                type="radio"
                name="opcion"
                checked={opcion === "10_80"}
                onChange={() => setOpcion("10_80")}
                className="mt-1"
              />
              <span>
                <strong>10 antes y 80 después</strong> — más días con el bebé después del parto.
              </span>
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn">
          Calcular mi licencia
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
            <p className="caption mb-1">Tu licencia va del</p>
            <p className="text-2xl font-semibold sm:text-3xl">
              {fechaLarga(resultado.inicio)}
            </p>
            <p className="caption my-1">hasta el</p>
            <p className="text-2xl font-semibold sm:text-3xl">{fechaLarga(resultado.fin)}</p>
            <p className="caption mt-2">
              {resultado.diasTotales} días · volvés a trabajar el día siguiente de terminar la
              licencia.
            </p>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div className="card">
              <h2 className="mb-1 text-base font-semibold">Tu parto estimado</h2>
              <p className="text-lg">{fechaLarga(resultado.fpp)}</p>
            </div>
            <div className="card">
              <h2 className="mb-1 text-base font-semibold">Para pedir la excedencia</h2>
              <p className="leading-relaxed">
                Tenés que avisar hasta el <strong>{fechaLarga(resultado.avisoExcedenciaLimite)}</strong>{" "}
                (48 horas antes de terminar la licencia). Si te la conceden, va entre el{" "}
                {fechaLarga(resultado.excedenciaMinima)} y el {fechaLarga(resultado.excedenciaMaxima)}{" "}
                (entre 3 y 6 meses, sin sueldo).
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <h2 className="mb-2 text-lg font-semibold">Tus derechos mientras tanto</h2>
            <ul className="list-disc space-y-1 pl-5 leading-relaxed text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>Estabilidad:</strong> no te pueden despedir desde que avisaste el embarazo
                con certificado médico (art. 177).
              </li>
              <li>
                <strong>Presunción de despido por embarazo:</strong> si te despiden dentro de los
                7 meses y medio anteriores o posteriores al parto, se presume que fue por el
                embarazo, salvo prueba en contrario, e indemniza el doble (art. 178).
              </li>
              <li>
                <strong>Sueldo durante la licencia:</strong> lo paga la ANSES (Asignación por
                Maternidad), a través de tu empleadora.
              </li>
            </ul>
          </div>

          <div className="warning mb-4">
            Herramienta informativa: para casos especiales (prematuro, embarazo de riesgo,
            empleados públicos o convenios propios con licencias más largas) consultá con tu
            empleador, gremio o un abogado laboralista.
          </div>

          <p className="caption">
            Base legal: {resultado.citas.join(" · ")}. Texto verificado en argentina.gob.ar.
          </p>
        </section>
      )}

      <section className="card">
        <h2 className="mb-2 text-lg font-semibold">Preguntas frecuentes</h2>
        <h3 className="mb-1 mt-3 font-semibold">¿Y si el bebé nace antes de la FPP?</h3>
        <p className="mb-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Los días de licencia que no llegaste a tomarte antes del parto se acumulan al período
          posterior: los 90 días totales no cambian (art. 177).
        </p>
        <h3 className="mb-1 font-semibold">¿La licencia es paga?</h3>
        <p className="mb-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Sí, al 100%: la paga la ANSES, no tu empleador. Percibís una suma igual a la
          retribución que te corresponde por la licencia legal.
        </p>
        <h3 className="mb-1 font-semibold">¿Después de la licencia qué?</h3>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          Podés volver a tu trabajo en las mismas condiciones, rescindir con una indemnización
          especial, o pedir la excedencia (entre 3 y 6 meses sin sueldo) si tuviste al menos un
          año de antigüedad (arts. 183 a 186).
        </p>
      </section>
    </div>
  );
}
