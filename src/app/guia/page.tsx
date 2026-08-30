import type { Metadata } from "next";
import Link from "@/components/link";
import { todasLasGuias } from "@/lib/articulos";

export const metadata: Metadata = {
  title: "Guías de embarazo, licencias y asignaciones",
  description:
    "Guías claras con fuentes oficiales: licencia por maternidad, excedencia, estabilidad laboral, AUE, prenatal, pago por nacimiento y más.",
  alternates: { canonical: "/guia/" },
};

export default function Page() {
  const guias = todasLasGuias();
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Guías</h1>
      <p className="mb-6 max-w-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
        Todo lo que necesitás saber sobre embarazo, derechos laborales y asignaciones en
        Argentina, con la ley y los montos oficiales citados en cada tabla.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {guias.map((g) => (
          <Link
            key={g.slug}
            href={`/guia/${g.slug}/`}
            className="card transition-colors hover:border-rose-300 dark:hover:border-rose-800"
          >
            <h2 className="mb-1 text-lg font-semibold">{g.titulo}</h2>
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{g.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
