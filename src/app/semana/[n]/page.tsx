import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSemana,
  todasLasSemanas,
  metadataSemanas,
  trimestreDeSemana,
  TOTAL_SEMANAS,
} from "@/lib/semanas";

export const dynamicParams = false;

export function generateStaticParams() {
  return todasLasSemanas().map((s) => ({ n: String(s.n) }));
}

function trimestreTexto(t: 1 | 2 | 3): string {
  return t === 1 ? "1er trimestre" : t === 2 ? "2do trimestre" : "3er trimestre";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const semana = getSemana(Number(n));
  if (!semana) return {};
  return {
    title: `Semana ${semana.n} de embarazo: ${semana.tamano}, síntomas y controles`,
    description: `Semana ${semana.n} de embarazo: qué pasa con tu bebé (${semana.tamano}), cómo evoluciona y qué control prenatal te toca en Argentina.`,
    alternates: { canonical: `/semana/${semana.n}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const num = Number(n);
  if (!Number.isInteger(num) || num < 1 || num > TOTAL_SEMANAS) notFound();
  const semana = getSemana(num);
  if (!semana) notFound();

  const meta = metadataSemanas();
  const trimestre = trimestreDeSemana(num);
  const anterior = num > 1 ? getSemana(num - 1) : null;
  const siguiente = num < TOTAL_SEMANAS ? getSemana(num + 1) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Semana ${semana.n} de embarazo`,
        description: `Qué pasa en la semana ${semana.n} de embarazo: tamaño del bebé, desarrollo y controles prenatales en Argentina.`,
        inLanguage: "es-AR",
        author: { "@type": "Organization", name: "Maternidad.ar" },
        publisher: { "@type": "Organization", name: "Maternidad.ar" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maternidad-ar.pages.dev/" },
          {
            "@type": "ListItem",
            position: 2,
            name: `Semana ${semana.n}`,
            item: `https://maternidad-ar.pages.dev/semana/${semana.n}/`,
          },
        ],
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header>
        <p className="caption">Semana a semana</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Semana {semana.n} de embarazo</h1>
        <p className="mt-2">
          <span className="badge-trimestre">{trimestreTexto(trimestre)}</span>
        </p>
      </header>

      <div className="verdict">
        <p className="caption mb-1">Tu bebé es aproximadamente del tamaño de</p>
        <p className="text-3xl font-semibold">
          {semana.tamano}
          {semana.medidaCm !== null && (
            <span className="text-base font-normal"> · ~{String(semana.medidaCm).replace(".", ",")} cm</span>
          )}
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Qué está pasando</h2>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{semana.desarrollo}</p>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-semibold">Tu control esta semana</h2>
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{semana.control}</p>
      </section>

      <section className="warning">
        Los tamaños son promedios aproximados: cada bebé tiene su ritmo y las variaciones normales
        son amplias. Esta página es informativa y no reemplaza tu control prenatal.
      </section>

      <section className="card">
        <h2 className="mb-2 text-lg font-semibold">¿En qué semana estás vos?</h2>
        <p className="mb-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Calculá tus semanas exactas y tu fecha probable de parto en un minuto.
        </p>
        <Link href="/calculadora-de-embarazo/" className="btn">
          Calculá tu embarazo →
        </Link>
      </section>

      <nav className="flex items-center justify-between gap-4" aria-label="Navegación entre semanas">
        {anterior ? (
          <Link
            href={`/semana/${anterior.n}/`}
            className="rounded-lg border border-neutral-200 px-4 py-2 hover:border-rose-400 dark:border-neutral-800"
          >
            ← Semana {anterior.n}
          </Link>
        ) : (
          <span />
        )}
        {siguiente ? (
          <Link
            href={`/semana/${siguiente.n}/`}
            className="rounded-lg border border-neutral-200 px-4 py-2 hover:border-rose-400 dark:border-neutral-800"
          >
            Semana {siguiente.n} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <p className="caption">
        Fuente: {meta.fuente}. {meta.nota}
      </p>
    </article>
  );
}
