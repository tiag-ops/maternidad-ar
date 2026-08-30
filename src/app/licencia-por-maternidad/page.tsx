import type { Metadata } from "next";
import LicenciaCliente from "./_cliente";

export const metadata: Metadata = {
  title: "Licencia por maternidad: calculá tus fechas exactas",
  description:
    "Calculá el inicio, el fin y el regreso al trabajo de tu licencia por maternidad según la ley argentina (Ley 20.744, art. 177): 45+45 o 10+80 días, aviso de excedencia incluido.",
  alternates: { canonical: "/licencia-por-maternidad/" },
};

export default function Page() {
  return <LicenciaCliente />;
}
