import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso de Maternidad.ar: naturaleza informativa de las herramientas, límites de responsabilidad y propiedad intelectual.",
  alternates: { canonical: "/terminos/" },
};

export default function Page() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">Términos y condiciones</h1>
      <div className="space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          1. Naturaleza del servicio
        </h2>
        <p>
          Maternidad.ar ofrece herramientas informativas gratuitas sobre embarazo, licencias
          laborales y asignaciones sociales en Argentina. Las calculadoras realizan cálculos
          matemáticos sobre datos públicos oficiales y no constituyen asesoramiento médico,
          jurídico, previsional ni fiscal.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          2. Exactitud de la información
        </h2>
        <p>
          Los montos y parámetros provienen de fuentes oficiales (ANSES, texto vigente de la Ley
          20.744, Ministerio de Salud) y se muestran con su fecha de vigencia. Igualmente, las
          normas y montos pueden cambiar sin preaviso, y ninguna calculadora reemplaza la consulta
          con tu médico, tu empleador, tu gremio o un profesional del derecho. Si encontrás una
          discrepancia con la fuente oficial, la fuente oficial prevalece.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          3. Límites de responsabilidad
        </h2>
        <p>
          El sitio se ofrece &laquo;tal cual&raquo;, sin garantías de disponibilidad continua ni
          de ausencia de errores. No somos responsables por decisiones tomadas en base a los
          resultados de las herramientas.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          4. Propiedad intelectual
        </h2>
        <p>
          Los textos y cálculos propios de Maternidad.ar pueden citarse con atribución y enlace.
          Las normativas citadas son de dominio público según el Decreto-Ley 1.853/73 (infoLEG).
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          5. Contacto
        </h2>
        <p>
          <a href="mailto:hola@maternidad.ar" className="acento underline">
            hola@maternidad.ar
          </a>
        </p>
        <p className="caption">Última actualización: agosto 2026.</p>
      </div>
    </div>
  );
}
