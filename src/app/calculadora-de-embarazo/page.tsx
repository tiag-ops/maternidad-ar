import type { Metadata } from "next";
import CalculadoraEmbarazoCliente from "./_cliente";

export const metadata: Metadata = {
  title: "Calculadora de embarazo: semanas y fecha probable de parto",
  description:
    "Calculá cuántas semanas de embarazo tenés, la fecha probable de parto y los hitos que vienen. Por última menstruación, duración del ciclo o FIV. Gratis y sin registro.",
  alternates: { canonical: "/calculadora-de-embarazo/" },
};

export default function Page() {
  return <CalculadoraEmbarazoCliente />;
}
