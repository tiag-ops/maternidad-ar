import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Quién hace Maternidad.ar, cómo elegimos las fuentes y cuál es nuestra política editorial.",
  alternates: { canonical: "/quienes-somos/" },
};

export default function Page() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">Quiénes somos</h1>
      <div className="space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        <p>
          Maternidad.ar es un sitio independiente y gratuito con calculadoras de embarazo, licencia
          por maternidad y asignaciones sociales de Argentina. Lo mantenemos con dos reglas simples:
          <strong> todo número viene de una fuente oficial</strong> (ANSES, texto vigente de la Ley
          20.744, Ministerio de Salud) y <strong>todo resultado muestra su fecha de vigencia</strong>.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Política editorial
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Los montos y fechas se verifican contra las páginas oficiales de ANSES y el texto
            vigente de la ley en argentina.gob.ar antes de publicarse, y se actualizan cuando las
            autoridades publican nuevos valores.
          </li>
          <li>
            No publicamos consejos médicos personalizados. Las calculadoras hacen matemática
            (fechas, plazos, montos); lo que no está en una fuente oficial no se muestra.
          </li>
          <li>
            Si una cifra puede cambiar (los montos de ANSES se ajustan por movilidad todos los
            meses), lo decimos y citamos la fecha exacta de vigencia.
          </li>
          <li>
            Los errores factuales se corrigen apenas se detectan. Podés avisarnos a{" "}
            <a href="mailto:hola@maternidad.ar" className="acento underline">
              hola@maternidad.ar
            </a>
            .
          </li>
        </ul>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Cómo nos financiamos
        </h2>
        <p>
          El sitio se sostiene con publicidad (Google AdSense). No vendemos datos, no hay
          contenido patrocinado ni enlaces pagos: la publicidad está separada del contenido y
          nunca dentro de las calculadoras.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Lo que no somos
        </h2>
        <p>
          No somos un servicio médico, un estudio jurídico ni un sitio oficial del Estado
          argentino. Para trámites y casos particulares, las fuentes son siempre{" "}
          <a
            href="https://www.anses.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="acento underline"
          >
            anses.gob.ar
          </a>
          ,{" "}
          <a
            href="https://www.argentina.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="acento underline"
          >
            argentina.gob.ar
          </a>{" "}
          y tu médico o asesora de confianza.
        </p>
        <p>
          Maternidad.ar es parte de una red chica de calculadoras gratuitas del mismo autor. Si
          además estás organizando el dinero de la familia, conocé{" "}
          <a
            href="https://reditos.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="acento underline"
          >
            Redito.ar
          </a>
          , calculadoras de plazo fijo, interés compuesto e inflación con datos oficiales del BCRA
          e INDEC.
        </p>
      </div>
    </div>
  );
}
