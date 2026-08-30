import type { Metadata } from "next";
import { fuenteDatos, montoAue, montoNacimiento, TOPE_IGF, TOPE_INTEGRANTE } from "@/lib/asignaciones";
import { fechaLarga } from "@/lib/fechas";
import { formatARS, formatARS0 } from "@/lib/format";
import PrenatalCliente from "./_cliente";

export const metadata: Metadata = {
  title: "Asignación por embarazo: cuánto cobrás según tu situación",
  description:
    "Montos oficiales de ANSES: Asignación por Embarazo para Protección Social (AUE), asignación prenatal, por nacimiento y por maternidad. Con fecha de vigencia y fuente oficial.",
  alternates: { canonical: "/asignacion-por-embarazo/" },
};

const fu = fuenteDatos();
const aue = montoAue();
const nac = montoNacimiento();

export default function Page() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Asignación por embarazo</h1>
      <p className="mb-4 max-w-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
        Cuánto cobrás depende de tu situación laboral. Todos los montos de esta página son los
        oficiales de ANSES vigentes desde el{" "}
        <strong>{fechaLarga(fu.vigenciaDesde)}</strong> (aumento del 1,89% por movilidad) y con
        enlace a la fuente oficial al pie.
      </p>
      <p className="caption mb-6">Vigencia: {fechaLarga(fu.vigenciaDesde)} · Fuente: {fu.fuente}</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Estás desempleada o en la informalidad</h2>
        <p className="mb-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Te corresponde la <strong>Asignación por Embarazo para Protección Social (AUE)</strong>,
          si tenés un embarazo de 12 semanas o más, estás inscripta en Sumar+ y hacés los controles
          prenatales.
        </p>
        <div className="verdict">
          <p className="caption mb-1">Cobrás cada mes (80%)</p>
          <p className="numero-resultado">{formatARS(aue.pagoMensual80)}</p>
          <p className="mt-2 leading-relaxed">
            Al acreditar el nacimiento cobrás el 20% acumulado:{" "}
            <strong>{formatARS(aue.complemento20)}</strong>.
          </p>
          <p className="caption mt-2">
            Total del embarazo: {formatARS(aue.totalMes)} por mes · Zona austral:{" "}
            {formatARS0(montoAue("austral").totalMes)} por mes.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Trabajás en relación de dependencia o monotributo</h2>
        <p className="mb-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Te corresponde la <strong>asignación prenatal</strong> (mensual, según el ingreso del
          grupo familiar) y la <strong>asignación por maternidad</strong> (100% de tu sueldo
          durante los 90 días de licencia, pagada por ANSES).
        </p>
        <PrenatalCliente />
        <p className="caption mt-2">
          Valores de zona general. Zonas 1 a 4 (Patagonia y zonas desfavorables) pagan más —
          <a href={fu.url} className="acento underline" target="_blank" rel="noopener noreferrer">
            {" "}
            cartilla oficial
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">Pago único por nacimiento</h2>
        <div className="card">
          <p className="text-2xl font-semibold">
            {formatARS0(nac.monto)} <span className="text-base font-normal">por única vez</span>
          </p>
          <p className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">
            Al acreditar el nacimiento. Condición: {nac.condicion}.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Topes para asignaciones familiares</h2>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
          El ingreso del grupo familiar (IGF) no puede superar{" "}
          <strong>{formatARS0(TOPE_IGF)}</strong> por mes, y ningún integrante individual puede
          superar {formatARS0(TOPE_INTEGRANTE)}. La asignación por maternidad no tiene tope de IGF.
        </p>
      </section>

      <div className="warning mb-6">
        Herramienta informativa con montos de fuente oficial. Para tu caso concreto (incluido el
        alta del trámite), consultá siempre ANSES. Si tu empleador no paga la prenatal, hablá con
        tu gremio o con la Secretaría de Trabajo.
      </div>

      <p className="caption">
        Fuente:{" "}
        <a href={fu.url} target="_blank" rel="noopener noreferrer" className="acento underline">
          Cartilla de montos de Asignaciones Familiares — ANSES
        </a>{" "}
        y{" "}
        <a
          href={fu.urlUniversal ?? fu.url}
          target="_blank"
          rel="noopener noreferrer"
          className="acento underline"
        >
          montos AUH/AUE oficiales
        </a>
        . Vigentes desde el {fechaLarga(fu.vigenciaDesde)}.
      </p>
    </div>
  );
}
