import type { Metadata } from "next";
import Link from "@/components/link";
import { todasLasSemanas, trimestreDeSemana, TOTAL_SEMANAS } from "@/lib/semanas";

export const metadata: Metadata = {
  title: "Embarazo semana a semana (1 a 40): qué pasa con tu bebé",
  description:
    "Qué pasa en cada semana del embarazo: tamaño del bebé, desarrollo, y qué control prenatal te toca según el calendario argentino. De la semana 1 a la 40.",
  alternates: { canonical: "/semana/" },
};

const TRIMESTRES = [
  {
    t: 1 as const,
    nombre: "Primer trimestre (1 a 13)",
    detalle: "Implantación, formación de los órganos y la ecografía de translucencia nuhal.",
  },
  {
    t: 2 as const,
    nombre: "Segundo trimestre (14 a 27)",
    detalle: "Ecografía morfológica, los primeros movimientos y el test de O'Sullivan al final.",
  },
  {
    t: 3 as const,
    nombre: "Tercer trimestre (28 a 40)",
    detalle: "Crecimiento final, término, controles semanales y preparación del nacimiento.",
  },
];

export default function Page() {
  const semanas = todasLasSemanas();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Embarazo semana a semana</h1>
      <p className="mb-6 max-w-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
        Cuarenta páginas, una por semana: qué tamaño tiene tu bebé, qué está desarrollando y qué
        control prenatal te toca según el calendario argentino. Si no sabés en qué semana estás,{" "}
        <Link href="/calculadora-de-embarazo/" className="acento underline">
          calculalo acá
        </Link>
        .
      </p>

      {TRIMESTRES.map(({ t, nombre, detalle }) => (
        <section key={t} className="mb-8" aria-label={nombre}>
          <h2 className="mb-1 text-xl font-semibold">{nombre}</h2>
          <p className="caption mb-3">{detalle}</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {semanas
              .filter((s) => trimestreDeSemana(s.n) === t)
              .map((s) => (
                <Link
                  key={s.n}
                  href={`/semana/${s.n}/`}
                  className="rounded-lg border border-neutral-200 px-2 py-2 text-center text-[15px] transition-colors hover:border-rose-400 hover:text-rose-700 dark:border-neutral-800 dark:hover:border-rose-700 dark:hover:text-rose-300"
                >
                  <span className="block font-semibold tabular-nums">{s.n}</span>
                  <span className="caption block truncate text-[13px] font-normal">{s.tamano}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <p className="caption">
        {TOTAL_SEMANAS} semanas · tamaños promedio aproximados: cada bebé tiene su ritmo.
      </p>
    </div>
  );
}
