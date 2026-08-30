import type { MetadataRoute } from "next";
import { calculadoras } from "@/lib/calculadoras";

export const dynamic = "force-static";

const BASE = "https://maternidad-ar.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const calcs = calculadoras.map((c) => ({
    url: `${BASE}/${c.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const legales = ["/privacidad/", "/terminos/", "/quienes-somos/"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [{ url: `${BASE}/`, changeFrequency: "weekly" as const, priority: 1 }, ...calcs, ...legales];
}
