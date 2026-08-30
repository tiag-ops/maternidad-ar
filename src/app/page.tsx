import type { Metadata } from "next";
import Link from "@/components/link";
import { calculadoras, CATEGORIAS } from "@/lib/calculadoras";
import { fuenteDatos, montoAue } from "@/lib/asignaciones";
import { fechaLarga } from "@/lib/fechas";
import { formatARS0 } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const fu = fuenteDatos();

export default function Home() {
  return (
    <div>
      <section className="mb-10">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
          Embarazo y maternidad en Argentina,{" "}
          <span className="acento">con números oficiales</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          Calculá tus semanas y la fecha probable de parto, las fechas exactas de tu licencia por
          maternidad y cuánto cobrás de asignaciones. Datos de ANSES y de la ley laboral
          argentina, con fuente y fecha de vigencia en cada resultado. Gratis, sin registro.
        </p>
      </section>

      <section aria-label="Calculadoras" className="mb-10 grid gap-4 sm:grid-cols-2">
        {calculadoras.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}/`}
            className="card transition-colors hover:border-rose-300 dark:hover:border-rose-800"
          >
            <div className="mb-2 text-3xl" aria-hidden>
              {c.icono}
            </div>
            <p className="caption mb-1">{CATEGORIAS[c.categoria]}</p>
            <h2 className="mb-1 text-lg font-semibold">{c.titulo}</h2>
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{c.descripcion}</p>
          </Link>
        ))}
      </section>

      <section aria-label="Seguimiento semana a semana" className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Tu embarazo semana a semana</h2>
          <Link href="/semana/" className="acento caption underline">
            Ver las 40 semanas
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((n) => (
            <Link
              key={n}
              href={`/semana/${n}/`}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 tabular-nums transition-colors hover:border-rose-400 dark:border-neutral-800 dark:hover:border-rose-700"
            >
              Semana {n}
            </Link>
          ))}
        </div>
      </section>

      <section className="verdict mb-10">
        <h2 className="mb-2 text-lg font-semibold">Datos con vigencia, no números viejos</h2>
        <p className="leading-relaxed">
          Los montos de asignaciones que mostramos son los oficiales de ANSES vigentes desde{" "}
          <strong>{fechaLarga(fu.vigenciaDesde)}</strong> (aumento del 1,89% por movilidad), y la
          licencia por maternidad se calcula con el texto actual de la Ley 20.744 según la Ley
          27.742. Cada resultado cita su fuente.
        </p>
      </section>

      <section aria-label="Preguntas frecuentes" className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">Preguntas rápidas</h2>
        <div className="card mb-3">
          <h3 className="mb-1 font-semibold">¿Cuántos días de licencia por maternidad tengo?</h3>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            90 días con sueldo: 45 antes del parto y 45 después, o si preferís, 10 antes y 80
            después. Tu empleo está protegido durante todo el embarazo y la licencia.{" "}
            <Link href="/licencia-por-maternidad/" className="acento underline">
              Calculá tus fechas exactas
            </Link>
            .
          </p>
        </div>
        <div className="card">
          <h3 className="mb-1 font-semibold">¿Cuánto cobro de asignación por embarazo?</h3>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Si estás desempleada o en la informalidad, la Asignación por Embarazo para Protección
            Social paga{" "}
            <strong>{formatARS0(montoAue().totalMes)} por mes</strong> (80% mensual + 20%
            acumulado).{" "}
            <Link href="/asignacion-por-embarazo/" className="acento underline">
              Ver según tu situación
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
