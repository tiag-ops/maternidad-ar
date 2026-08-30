import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { todasLasGuias, getGuia } from "@/lib/articulos";
import { ArticuloView } from "@/lib/articulos/articulo-view";
import { fuenteDatos } from "@/lib/asignaciones";
import { fechaLarga } from "@/lib/fechas";

/** Sin params dinámicos en runtime: output export prerenderiza solo los slugs del índice. */
export const dynamicParams = false;

export function generateStaticParams() {
  return todasLasGuias().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = getGuia(slug);
  if (!guia) return {};
  return {
    title: guia.titulo,
    description: guia.descripcion,
    alternates: { canonical: `/guia/${slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guia = getGuia(slug);
  if (!guia) notFound();
  const fecha = fechaLarga(fuenteDatos().actualizadoEl);
  return <ArticuloView guia={guia} fecha={fecha} />;
}
