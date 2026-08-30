import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos tratamos (casi ninguno), cookies de Google AdSense y tus derechos según la ley argentina.",
  alternates: { canonical: "/privacidad/" },
};

export default function Page() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">Política de privacidad</h1>
      <div className="space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        <p>
          Maternidad.ar está hecho para que no tengas que darle datos a nadie para usarlo. Las
          calculadoras funcionan 100% en tu navegador: lo que escribís (fechas, ingresos) no se
          envía a ningún servidor ni se guarda en nuestras bases de datos.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Qué guardamos
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Tu preferencia de tema</strong> (claro/oscuro) en el almacenamiento local de tu
            navegador. Nunca sale de tu dispositivo.
          </li>
          <li>
            <strong>Nada más.</strong> No hay cuentas, no hay registro, no hay formularios que
            envíen datos.
          </li>
        </ul>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Publicidad y cookies de terceros
        </h2>
        <p>
          El sitio muestra publicidad de Google AdSense. Google y sus socios usan cookies para
          mostrar anuncios basados en tus visitas a este y otros sitios. Podés desactivar la
          publicidad personalizada en{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="acento underline"
          >
            Configuración de anuncios de Google
          </a>
          , o gestionar las cookies desde tu navegador.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Análisis de uso
        </h2>
        <p>
          Medimos visitas agregadas y anónimas (cuántas páginas se ven, desde qué país) para saber
          qué contenido es útil. No identificamos personas.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Tus derechos
        </h2>
        <p>
          Rige la Ley de Protección de Datos Personales 25.326 de Argentina. Como no tratamos
          datos personales, no hay nada que acceder, rectificar o eliminar: si en el futuro eso
          cambia, actualizaremos esta política. Consultas:{" "}
          <a href="mailto:hola@maternidad.ar" className="acento underline">
            hola@maternidad.ar
          </a>
          .
        </p>
        <p className="caption">Última actualización: agosto 2026.</p>
      </div>
    </div>
  );
}
