import type { MetadataRoute } from "next";
import { calculadoras } from "@/lib/calculadoras";
import { todasLasGuias } from "@/lib/articulos";
import { todasLasSemanas } from "@/lib/semanas";

export const dynamic = "force-static";

const BASE = "https://maternidad-ar.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const calcs = calculadoras.map((c) => ({
    url: `${BASE}/${c.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const indiceGuias = [{ url: `${BASE}/guia/`, changeFrequency: "weekly" as const, priority: 0.8 }];

  const guias = todasLasGuias().map((g) => ({
    url: `${BASE}/guia/${g.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const semanas = todasLasSemanas().map((s) => ({
    url: `${BASE}/semana/${s.n}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const legales = ["/privacidad/", "/terminos/", "/quienes-somos/"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    { url: `${BASE}/`, changeFrequency: "weekly" as const, priority: 1 },
    ...calcs,
    ...indiceGuias,
    ...guias,
    ...semanas,
    ...legales,
  ];
}
