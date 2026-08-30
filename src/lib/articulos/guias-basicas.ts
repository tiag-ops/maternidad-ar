/** Guías básicas: licencia, AUE, nacimiento, paternidad.
 * REGLA: ningún monto hardcodeado — todo sale de los datos oficiales via tablasVivas(). */

import datos from "@/data/anses.json";
import { Guia } from "./tipos";

const d = datos as {
  aue: {
    totalMes: number;
    pagoMensual80: number;
    complemento20: number;
    zonaAustral: { totalMes: number; pagoMensual80: number; complemento20: number };
  };
  nacimiento: { monto: number };
  adopcion: { monto: number };
  topes: { igfMaximo: number };
};

function ars(n: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export function guiasBasicas(): Guia[] {
  return [
    {
      slug: "licencia-por-maternidad-cuantos-dias",
      titulo: "Licencia por maternidad: cuántos días son y cómo se reparten",
      descripcion:
        "90 días paga por ley (art. 177 LCT): 45 antes y 45 después del parto, o 10 antes y 80 después. Cómo avisar a tu empleador y qué pasa si el bebé nace antes.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La licencia por maternidad en Argentina son 90 días con derecho al cobro de tu sueldo completo, cubierto por la ANSES. La regla está en el artículo 177 de la Ley de Contrato de Trabajo (texto vigente según la Ley 27.742) y te da dos opciones para repartir esos días.",
        },
        {
          tipo: "tabla",
          headers: ["Opción", "Antes del parto", "Después del parto", "Ideal para"],
          filas: [
            ["45 + 45 (la común)", "45 días", "45 días", "Embarazo sin complicaciones"],
            ["10 + 80", "10 días", "80 días", "Querés más tiempo con el bebé después"],
          ],
          caption:
            "Opciones del art. 177, Ley 20.744 (texto según Ley 27.742, B.O. 8/7/2024). La suma es siempre 90 días.",
        },
        {
          tipo: "h2",
          texto: "Qué necesitás para arrancar la licencia",
        },
        {
          tipo: "ul",
          items: [
            "Un certificado médico con la fecha presunta del parto (FPP): es el documento que activa todos tus derechos.",
            "Comunicarlo fehacientemente a tu empleador: guardá copia con firma o mandalo por un canal que quede registrado.",
            "Elegir la repartición (45/45 o 10/80): podés optar, y la reducción del período previo no puede ser menor a 10 días.",
          ],
        },
        {
          tipo: "h2",
          texto: "Si el bebé nace antes de la fecha",
        },
        {
          tipo: "p",
          texto:
            "En un nacimiento pretérmino, todos los días de licencia que no llegaste a usar antes del parto se acumulan al período posterior. El total de 90 días no cambia: nadie pierde días por un parto anticipado.",
        },
        {
          tipo: "p",
          texto:
            "Además, desde que notificás el embarazo con certificado, tenés estabilidad en el empleo (no te pueden despedir) y, si te despidieran dentro de los 7 meses y medio previos o posteriores al parto, la ley presume que fue por el embarazo y la indemnización se duplica (art. 178).",
        },
        { tipo: "calc", href: "/licencia-por-maternidad/", texto: "Calculá tus fechas exactas" },
      ],
      faqs: [
        {
          pregunta: "¿La licencia es paga al 100%?",
          respuesta:
            "Sí. Durante los 90 días la ANSES te paga una suma igual a tu retribución (art. 177). No le cuesta dinero a tu empleador.",
        },
        {
          pregunta: "¿Puedo empezar la licencia más de 45 días antes?",
          respuesta:
            "Por ley el máximo previo es 45 días, pero si tenés un embarazo de riesgo tu médico puede darte reposo pago por enfermedad inculpable (art. 208), que es un mecanismo aparte.",
        },
        {
          pregunta: "¿Los 90 días cuentan como antigüedad?",
          respuesta:
            "Sí, la licencia por maternidad no interrumpe la relación laboral ni la antigüedad. (Los plazos de excedencia, en cambio, no computan.)",
        },
      ],
      relacionadas: [
        { titulo: "Calculadora de licencia", href: "/licencia-por-maternidad/" },
        { titulo: "Excedencia: cómo funciona", href: "/guia/excedencia-como-funciona/" },
        { titulo: "Embarazo semana a semana", href: "/semana/" },
      ],
    },
    {
      slug: "asignacion-universal-por-embarazo-requisitos",
      titulo: "Asignación por embarazo para Protección Social (AUE): requisitos y cuánto pagan",
      descripcion:
        `La AUE paga ${ars(datos.aue.totalMes)} por mes (80% mensual + 20% acumulado). Requisitos: embarazo de 12+ semanas, estar desempleada o en la informalidad, Sumar+ y controles al día.`,
      bloques: [
        {
          tipo: "p",
          texto:
            "La Asignación por Embarazo para Protección Social (que muchos llaman 'asignación universal por embarazo') acompaña a quienes están desempleadas, trabajan en la informalidad o son monotributistas sociales. La paga ANSES todos los meses desde la semana 12 de embarazo.",
        },
        {
          tipo: "h2",
          texto: "Cuánto pagan en 2026",
        },
        {
          tipo: "tabla",
          headers: ["Concepto", "Zona general", "Zona austral"],
          filas: [
            ["Cobrás cada mes (80%)", ars(d.aue.pagoMensual80), ars(d.aue.zonaAustral.pagoMensual80)],
            ["20% acumulado al acreditar el nacimiento", ars(d.aue.complemento20), ars(d.aue.zonaAustral.complemento20)],
            ["Total por mes de embarazo", ars(d.aue.totalMes), ars(d.aue.zonaAustral.totalMes)],
          ],
          caption: "Montos oficiales ANSES vigentes desde el 01/08/2026 (aumento 1,89%).",
        },
        {
          tipo: "h2",
          texto: "Requisitos",
        },
        {
          tipo: "ul",
          items: [
            "Embarazo de 12 semanas o más (acreditado con certificado médico o el formulario PS 2.67).",
            "Ser argentina o naturalizada con DNI; si sos extranjera, 3 años de residencia.",
            "Estar inscripta en Sumar+ y hacer los controles prenatales que establece el programa.",
            "No tener obra social (excepto monotributistas sociales, casas particulares y desempleadas con cobertura por 3 meses post-cese).",
            "Pertenecer a alguno de estos grupos: desocupada, trabajadora informal con ingresos bajo el salario mínimo, monotributista social, casas particulares registradas o programas sociales.",
          ],
        },
        {
          tipo: "h2",
          texto: "Cómo es el pago",
        },
        {
          tipo: "p",
          texto:
            "Cada mes cobrás el 80% del monto. El 20% restante se acumula y se cobra al presentar el formulario PS 2.10 con el certificado del nacimiento (o nacimiento sin vida / interrupción), dentro de los 12 meses desde el fin del embarazo. Si estás inscripta en Sumar+, el Ministerio de Salud envía tu información a ANSES y podés cobrar de forma automática.",
        },
        { tipo: "calc", href: "/asignacion-por-embarazo/", texto: "Ver todos los montos por situación" },
      ],
      faqs: [
        {
          pregunta: "¿Desde cuándo cobro?",
          respuesta:
            "Desde la semana 12 de embarazo, con retroactivo a la presentación del trámite. Por eso conviene presentarlo apenas pasás las 12 semanas.",
        },
        {
          pregunta: "¿Y si ya cobro AUH por otro hijo?",
          respuesta:
            "Podés cobrar AUE y AUH a la vez: la AUE es por el embarazo en curso y la AUH por tus otros hijos.",
        },
        {
          pregunta: "¿Qué pasa si me falta un control prenatal?",
          respuesta:
            "Los controles son la condición para seguir cobrando. Si se te complica, avisá en ANSES antes de que se acumulen inasistencias: hay reinstalaciones posibles, pero es mejor prevenir.",
        },
      ],
      relacionadas: [
        { titulo: "Calculadora de asignaciones", href: "/asignacion-por-embarazo/" },
        { titulo: "Pago único por nacimiento", href: "/guia/asignacion-por-nacimiento-cuanto-cobra/" },
      ],
    },
    {
      slug: "asignacion-por-nacimiento-cuanto-cobra",
      titulo: "Asignación por nacimiento: cuánto cobran y cómo pedirlo",
      descripcion:
        `El pago único por nacimiento es de ${ars(datos.nacimiento.monto)} en 2026 (y ${ars(datos.adopcion.monto)} por adopción). Quiénes lo cobran, cuándo y cómo.`,
      bloques: [
        {
          tipo: "p",
          texto:
            "La asignación por nacimiento es un pago único que ANSES (o tu empleador, según el régimen) abona cuando nace tu hijo. Se cobra por cada nacimiento, y también existe la versión por adopción.",
        },
        {
          tipo: "tabla",
          headers: ["Asignación", "Monto (zona general)", "Condición"],
          filas: [
            ["Por nacimiento (pago único)", ars(d.nacimiento.monto), `IGF del grupo hasta ${ars(d.topes.igfMaximo)}`],
            ["Por adopción (pago único)", ars(d.adopcion.monto), `IGF del grupo hasta ${ars(d.topes.igfMaximo)}`],
          ],
          caption: "Montos oficiales ANSES vigentes desde el 01/08/2026. Zonas 1 a 4 pagan más.",
        },
        {
          tipo: "h2",
          texto: "Quién lo cobra",
        },
        {
          tipo: "ul",
          items: [
            "Trabajadoras en relación de dependencia (lo paga el empleador, que lo recupera de ANSES).",
            "Monotributistas y titulares de AUH / AUE (lo paga ANSES).",
            "Jubiladas y pensionadas con hijo a cargo.",
          ],
        },
        {
          tipo: "h2",
          texto: "Cómo se pide",
        },
        {
          tipo: "p",
          texto:
            "Si estás en relación de dependencia, se lo solicitás a tu empleador con el certificado del nacimiento (partida o DNI del bebé). Si sos titular de AUE/AUH/monotributo, se pide en ANSES con turno y el mismo certificado. Tenés tiempo, pero conviene hacerlo pronto: el pago no se acumula con otros trámites.",
        },
        { tipo: "calc", href: "/asignacion-por-embarazo/", texto: "Ver montos según tu situación" },
      ],
      faqs: [
        {
          pregunta: "¿Los gemelos cobran doble?",
          respuesta:
            "Sí: la asignación por nacimiento se paga por cada hijo nacido vivo, así que en un parto múltiple corresponde un pago por bebé.",
        },
        {
          pregunta: "¿Y si nadie del grupo trabaja en blanco?",
          respuesta:
            "Si cobrás AUE tenés el acompañamiento del régimen de Protección Social, que incluye pagos por nacimiento: confirmá el monto vigente en ANSES al momento del trámite, porque no lo publicamos si no está en la fuente oficial.",
        },
      ],
      relacionadas: [
        { titulo: "AUE: requisitos", href: "/guia/asignacion-universal-por-embarazo-requisitos/" },
        { titulo: "Calculadora de asignaciones", href: "/asignacion-por-embarazo/" },
      ],
    },
    {
      slug: "licencia-por-nacimiento-para-el-padre",
      titulo: "Licencia por nacimiento para el padre: cuántos días son",
      descripcion:
        "2 días corridos por nacimiento según el art. 158 de la LCT — y hasta 5 en el sector público. Cómo pedirlos y qué convenios dan más.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La licencia por nacimiento para el progenitor no gestante en el empleo privado son 2 días corridos (art. 158, inciso a, Ley 20.744). Es una de las licencias más cortas de la región, pero hay situaciones que la extienden.",
        },
        {
          tipo: "tabla",
          headers: ["Empleo", "Días por nacimiento", "Base legal"],
          filas: [
            ["Privado (LCT)", "2 días corridos", "Art. 158 inc. a, Ley 20.744"],
            ["Sector público nacional", "5 días corridos", "Reglamentación específica del empleo público"],
          ],
          caption: "Los convenios colectivos pueden mejorar estos mínimos, nunca reducirlos.",
        },
        {
          tipo: "h2",
          texto: "Cómo pedirlos",
        },
        {
          tipo: "ul",
          items: [
            "Avisá a tu empleador con el certificado de nacimiento (o la partida provisional del hospital).",
            "Los días se toman inmediatamente después del nacimiento.",
            "Si tu convenio colectivo da más días (varios dan 3 a 5), pedí la mejora: el convenio siempre gana.",
          ],
        },
        {
          tipo: "p",
          texto:
            "Ojo con el dato legal: hay un proyecto de ley de licencias parentales en el Congreso que extendería esta licencia a 45 días. No está vigente — te contamos su estado en la guía del proyecto.",
        },
        { tipo: "calc", href: "/calculadora-de-embarazo/", texto: "Calcular la fecha probable de parto" },
      ],
      faqs: [
        {
          pregunta: "¿Los 2 días son paga?",
          respuesta:
            "Sí, son licencia paga ordinaria: no te descuentan el sueldo ni los días.",
        },
        {
          pregunta: "¿Puedo tomarme la licencia de mi pareja?",
          respuesta:
            "No: la licencia por maternidad es personal de la trabajadora gestante. Lo que sí pueden compartir son vacaciones o días compensados si el empleador lo acepta.",
        },
      ],
      relacionadas: [
        { titulo: "Proyecto de licencias parentales", href: "/guia/proyecto-ley-licencias-parentales/" },
        { titulo: "Licencia por maternidad", href: "/licencia-por-maternidad/" },
      ],
    },
  ];
}
