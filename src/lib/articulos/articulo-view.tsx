import Link from "@/components/link";
import { Bloque, Guia } from "./tipos";

/** Renderiza un bloque de guía. Los datos de las tablas ya vienen vivos del data layer. */
function BloqueView({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo) {
    case "p":
      return <p className="leading-relaxed">{bloque.texto}</p>;
    case "h2":
      return <h2 className="pt-2 text-xl font-semibold">{bloque.texto}</h2>;
    case "ul":
      return (
        <ul className="list-disc space-y-1 pl-5">
          {bloque.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "tabla":
      return (
        <figure>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
                  {bloque.headers.map((h) => (
                    <th key={h} className="py-2 pr-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloque.filas.map((fila, i) => (
                  <tr key={i} className="border-b border-neutral-100 dark:border-neutral-900">
                    {fila.map((celda, j) => (
                      <td key={j} className="py-2 pr-4">
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bloque.caption && (
            <figcaption className="caption mt-2">{bloque.caption}</figcaption>
          )}
        </figure>
      );
    case "calc":
      return (
        <Link href={bloque.href} className="btn">
          {bloque.texto} →
        </Link>
      );
  }
}

/** Página de artículo completa con JSON-LD Article + FAQPage. */
export function ArticuloView({ guia, fecha }: { guia: Guia; fecha: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guia.titulo,
        description: guia.descripcion,
        datePublished: fecha,
        dateModified: fecha,
        inLanguage: "es-AR",
        author: { "@type": "Organization", name: "Maternidad.ar" },
        publisher: { "@type": "Organization", name: "Maternidad.ar" },
      },
      {
        "@type": "FAQPage",
        mainEntity: guia.faqs.map((f) => ({
          "@type": "Question",
          name: f.pregunta,
          acceptedAnswer: { "@type": "Answer", text: f.respuesta },
        })),
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
        <p className="caption">Guía</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{guia.titulo}</h1>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-neutral-300">
          {guia.descripcion}
        </p>
        <p className="caption mt-1">
          Actualizado con datos oficiales · {fecha}
        </p>
      </header>

      <div className="space-y-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        {guia.bloques.map((b, i) => (
          <BloqueView key={i} bloque={b} />
        ))}
      </div>

      <section className="card">
        <h2 className="caption mb-3 font-semibold uppercase tracking-wide">
          Preguntas frecuentes
        </h2>
        <div className="space-y-4">
          {guia.faqs.map((f) => (
            <div key={f.pregunta}>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{f.pregunta}</h3>
              <p className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">
                {f.respuesta}
              </p>
            </div>
          ))}
        </div>
      </section>

      <nav className="flex flex-wrap gap-3" aria-label="Relacionadas">
        {guia.relacionadas.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-lg border border-neutral-200 px-4 py-2 hover:border-rose-400 dark:border-neutral-800"
          >
            {r.titulo} →
          </Link>
        ))}
      </nav>
    </article>
  );
}
