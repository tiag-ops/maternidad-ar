/** Guías avanzadas: derechos laborales, excedencia, estabilidad, prenatal, maternidad.
 * REGLA: ningún monto hardcodeado — todo sale de los datos oficiales via tablasVivas(). */

import datos from "@/data/anses-2026-08.json";
import { Guia } from "./tipos";

interface Tramo {
  rango: string;
  valores: Record<string, number>;
}

const d = datos as {
  prenatal: { tramos: Tramo[] };
  topes: { igfMaximo: number; integranteMaximo: number };
};

function ars(n: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export function guiasAvanzadas(): Guia[] {
  return [
    {
      slug: "embarazo-y-trabajo-derechos",
      titulo: "Embarazo y trabajo: todos tus derechos en Argentina",
      descripcion:
        "Estabilidad, licencia paga, descansos por lactancia, cambio de tareas y qué hacer si te discriminan. Guía completa con los artículos de ley.",
      bloques: [
        {
          tipo: "p",
          texto:
            "Trabajar embarazada en Argentina está protegido por la Ley de Contrato de Trabajo con una batería de derechos que van mucho más allá de la licencia. Esta guía los reúne todos con su base legal.",
        },
        {
          tipo: "h2",
          texto: "El derecho que activa todos los demás: notificar el embarazo",
        },
        {
          tipo: "p",
          texto:
            "Presentá a tu empleador un certificado médico con la fecha presunta del parto. Desde ese momento la estabilidad es un derecho adquirido, y empiezan a correr el resto de las protecciones. No hace falta que lo sepas en la semana 4: la ley protege desde la notificación (aunque el despido dentro de los 7,5 meses previos al parto se presume que es por embarazo aunque no hayas avisado).",
        },
        {
          tipo: "h2",
          texto: "Derecho por derecho",
        },
        {
          tipo: "tabla",
          headers: ["Derecho", "Qué dice la ley", "Artículo"],
          filas: [
            ["Licencia por maternidad", "90 días paga (45+45 u 10+80)", "Art. 177"],
            ["Estabilidad", "No podés ser despedida durante el embarazo y la licencia", "Art. 177"],
            ["Presunción de despido", "Despido 7,5 meses antes/después del parto = indemnización agravada", "Art. 178"],
            ["Descansos por lactancia", "2 descansos de media hora por día, hasta el año del bebé", "Art. 179"],
            ["Licencia del progenitor", "2 días corridos por nacimiento", "Art. 158 inc. a"],
            ["Excedencia", "3 a 6 meses más, sin sueldo, a tu opción", "Arts. 183-186"],
          ],
          caption: "Ley 20.744 (LCT), texto vigente verificado en argentina.gob.ar (agosto 2026).",
        },
        {
          tipo: "h2",
          texto: "El sueldo durante la licencia lo paga ANSES",
        },
        {
          tipo: "p",
          texto:
            "Durante los 90 días no te descuentan sueldo: la ANSES abona la Asignación por Maternidad, igual a tu retribución. La prenatal (mensual durante el embarazo) la paga tu empleador según el ingreso del grupo familiar.",
        },
        {
          tipo: "h2",
          texto: "Si te discriminan o despiden igual",
        },
        {
          tipo: "ul",
          items: [
            "El despido dentro de la ventana del art. 178 se presume por maternidad: corresponde la indemnización del art. 182 (equivalente a un año de sueldo, más la ordinaria).",
            "Reuní prueba: comunicaciones escritas, certificados, testigos.",
            "Reclamá primero por el área de RRHH o tu gremio; después, Secretaría de Trabajo o abogado laboralista (muchos laboratorios jurídicos de universidades asesoran gratis).",
          ],
        },
        { tipo: "calc", href: "/licencia-por-maternidad/", texto: "Calculá tu licencia" },
      ],
      faqs: [
        {
          pregunta: "¿Pueden cambiarme de tareas por el embarazo?",
          respuesta:
            "Sí, si hay riesgo para la salud, siempre que sea transitorio, justificado por un médico y sin rebaja de sueldo. No es una vía legítima para 'apartarte' del equipo.",
        },
        {
          pregunta: "¿Tengo que avisar cuántos meses tengo?",
          respuesta:
            "Solo lo que figure en el certificado médico (FPP). Tu historia clínica es privada: no tenés que dar más detalles médicos de los necesarios.",
        },
        {
          pregunta: "¿Me pueden echar estando de licencia?",
          respuesta:
            "No. La estabilidad cubre embarazo y licencia, y el despido en la ventana del art. 178 tiene presunción en tu favor. Un despido así es nulificable e indemnizable.",
        },
      ],
      relacionadas: [
        { titulo: "Estabilidad laboral detallada", href: "/guia/estabilidad-laboral-embarazada/" },
        { titulo: "Excedencia", href: "/guia/excedencia-como-funciona/" },
        { titulo: "Embarazo semana a semana", href: "/semana/" },
      ],
    },
    {
      slug: "excedencia-como-funciona",
      titulo: "Excedencia: cómo estirar la licencia sin sueldo (3 a 6 meses)",
      descripcion:
        "Después de los 90 días podés quedarte más tiempo con tu bebé sin perder el puesto: cómo pedir la excedencia, el aviso de 48 horas y el reingreso.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La excedencia es el período voluntario sin sueldo que podés tomar después de la licencia por maternidad: entre 3 y 6 meses. Conservás el empleo y el derecho a volver a tu puesto. Es la herramienta que la LCT (arts. 183 a 186) le da a las madres para decidir cuándo volver.",
        },
        {
          tipo: "h2",
          texto: "Los tres caminos al terminar la licencia",
        },
        {
          tipo: "tabla",
          headers: ["Opción", "Qué implica", "Requiere"],
          filas: [
            ["Volver a trabajar", "Mismo puesto y condiciones", "Nada: es el default"],
            ["Excedencia (3–6 meses)", "Sin sueldo, sin antigüedad por esos meses, con reserva del puesto", "1 año de antigüedad + aviso 48 h antes de terminar la licencia"],
            ["Rescindir", "Indemnización especial: 25% de un sueldo por año de servicio (tope: 1 sueldo por año)", "1 año de antigüedad"],
          ],
          caption: "Arts. 183, 185 y 186, Ley 20.744.",
        },
        {
          tipo: "h2",
          texto: "El aviso que no podés olvidar",
        },
        {
          tipo: "p",
          texto:
            "Para irte de excedencia tenés que comunicarlo dentro de las últimas 48 horas de la licencia por maternidad. Si no avisás y no te presentás, la ley entiende que optaste por la indemnización de rescisión (art. 186): o sea, renunciaste con esa compensación. Es una trampa clásica — avisá por escrito y guardá constancia.",
        },
        {
          tipo: "h2",
          texto: "El reingreso",
        },
        {
          tipo: "ul",
          items: [
            "Al terminar la excedencia, el empleador debe reincorporarte a un cargo de tu misma categoría (art. 184).",
            "Si no te reincorpora y no prueba imposibilidad, te indemniza como despido injustificado.",
            "Si te reincorpora a un cargo distinto, puede ser superior o inferior solo de común acuerdo.",
          ],
        },
        { tipo: "calc", href: "/licencia-por-maternidad/", texto: "Calculá tu fecha límite de aviso" },
      ],
      faqs: [
        {
          pregunta: "¿Cobra algo durante la excedencia?",
          respuesta:
            "No: es sin goce de sueldo. Los meses de excedencia tampoco computan antigüedad. Lo que te conserva es el puesto.",
        },
        {
          pregunta: "¿Puedo cortar la excedencia antes?",
          respuesta:
            "Sí, avisando con antelación razonable podés volver antes del plazo que pediste. Lo que no podés es exceder el máximo de 6 meses.",
        },
        {
          pregunta: "¿Sirve para el empleo público?",
          respuesta:
            "El régimen público tiene sus propias normas y suelen ser más generosas (a menudo se asimila a licencia sin sueldo de hasta un año). Revisá tu estatuto o convenio.",
        },
      ],
      relacionadas: [
        { titulo: "Licencia por maternidad", href: "/licencia-por-maternidad/" },
        { titulo: "Tus derechos en el trabajo", href: "/guia/embarazo-y-trabajo-derechos/" },
      ],
    },
    {
      slug: "estabilidad-laboral-embarazada",
      titulo: "Estabilidad laboral de la embarazada: qué significa y cómo se defiende",
      descripcion:
        "Desde que notificás el embarazo no te pueden despedir. Qué cubre la estabilidad, la indemnización agravada del art. 182 y cómo reclamarla.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La estabilidad laboral es la garantía más fuerte del paquete: desde el momento en que notificás tu embarazo con certificado médico (y con carácter de derecho adquirido), tu empleo queda reservado durante todo el embarazo, la licencia y el retorno. Un despido en ese período no es solo injusto: es ineficaz, salvo que el empleador pruebe una causa grave no relacionada.",
        },
        {
          tipo: "h2",
          texto: "La presunción del art. 178: el escudo de los 7,5 meses",
        },
        {
          tipo: "p",
          texto:
            "Si te despiden dentro de los siete meses y medio anteriores o posteriores al parto (habiendo notificado el embarazo/nacimiento), la ley presume que el motivo fue el embarazo. En ese caso te corresponde la indemnización agravada del art. 182: equivalente a un año de remuneración, además de la indemnización ordinaria por antigüedad.",
        },
        {
          tipo: "h2",
          texto: "Cómo defender la estabilidad en la práctica",
        },
        {
          tipo: "ul",
          items: [
            "Notificá por escrito y con constancia: el derecho nace con la notificación fehaciente.",
            "Guardá todo: telegramas, mails, certificados médicos, recibos.",
            "Si te despiden igual: no firmes acuerdos en el momento; el despido puede cuestionarse en sede laboral.",
            "Sindicato o SECT (Secretaría de Trabajo) hacen gratuidad o asesoramiento inicial; los laboratorios jurídicos universitarios también.",
          ],
        },
        {
          tipo: "p",
          texto:
            "La estabilidad también protege contra rebajas encubiertas: cambios de sector 'sugeridos', degradaciones o traslados punitivos durante el embarazo son cuestionables.",
        },
        { tipo: "calc", href: "/licencia-por-maternidad/", texto: "Ver tus fechas protegidas" },
      ],
      faqs: [
        {
          pregunta: "¿La estabilidad cubre el embarazo en período de prueba?",
          respuesta:
            "El período de prueba no habilita a despedir por embarazo: la presunción del art. 178 y la prohibición de discriminación (art. 17 bis LCT) aplican igual.",
        },
        {
          pregunta: "¿Y si el despido es por causa real (mal desempeño)?",
          respuesta:
            "El empleador debe probarla con contundencia, y ni siquiera esa prueba salva un despido durante la licencia misma. En la práctica, el estándar probatorio es altísimo.",
        },
      ],
      relacionadas: [
        { titulo: "Derechos completos", href: "/guia/embarazo-y-trabajo-derechos/" },
        { titulo: "Excedencia", href: "/guia/excedencia-como-funciona/" },
      ],
    },
    {
      slug: "prenatal-tramos-igf-cuanto-cobra",
      titulo: "Asignación prenatal: cuánto cobrás según tu sueldo (tramos 2026)",
      descripcion:
        "La prenatal se paga por tramos del ingreso del grupo familiar. Tabla completa de montos vigentes, topes de exclusión y cómo se calcula el IGF.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La asignación por prenatal acompaña a la trabajadora embarazada en relación de dependencia (y a monotributistas) desde la semana 20 hasta el nacimiento. Su monto depende del Ingreso del Grupo Familiar (IGF): más ingreso, menor asignación.",
        },
        {
          tipo: "h2",
          texto: "Tabla de tramos (zona general, vigente desde 01/08/2026)",
        },
        {
          tipo: "tabla",
          headers: ["Ingreso del grupo familiar (mensual)", "Prenatal por mes"],
          filas: d.prenatal.tramos.map((t) => [t.rango, ars(t.valores.general)]),
          caption: "Fuente: cartilla oficial de montos de Asignaciones Familiares, ANSES.",
        },
        {
          tipo: "h2",
          texto: "Los topes que te excluyen",
        },
        {
          tipo: "ul",
          items: [
            `Si el IGF supera ${ars(d.topes.igfMaximo)}, el grupo queda fuera del régimen de asignaciones familiares.`,
            `Si algún integrante solo supera ${ars(d.topes.integranteMaximo)} brutos, también excluye al grupo entero.`,
            "La Asignación por Maternidad (durante la licencia) no tiene tope de IGF: se cobra siempre.",
          ],
        },
        {
          tipo: "h2",
          texto: "Cómo se calcula el IGF",
        },
        {
          tipo: "p",
          texto:
            "Se suman los ingresos brutos declarados en el F.931 (sueldos de quienes trabajan en relación de dependencia), las rentas de referencia de monotributo y autónomos, haberes de jubilación, desempleo y planes. No cuentan horas extra, plus por zona desfavorable ni aguinaldo. La zona austral (zonas 1 a 4) paga montos más altos.",
        },
        { tipo: "calc", href: "/asignacion-por-embarazo/", texto: "Calculá tu prenatal con tu IGF" },
      ],
      faqs: [
        {
          pregunta: "¿Desde qué semana se cobra la prenatal?",
          respuesta:
            "Desde la semana 20 de gestación (o desde que se acredita el embarazo si entrás después), y se cobra mientras dure el embarazo.",
        },
        {
          pregunta: "¿La paga el empleador o ANSES?",
          respuesta:
            "En relación de dependencia la paga el empleador mensualmente y luego se la compensa ANSES. En monotributo, la paga ANSES directamente.",
        },
      ],
      relacionadas: [
        { titulo: "Calculadora de asignaciones", href: "/asignacion-por-embarazo/" },
        { titulo: "AUE: requisitos", href: "/guia/asignacion-universal-por-embarazo-requisitos/" },
      ],
    },
    {
      slug: "asignacion-por-maternidad-sueldo-licencia",
      titulo: "Asignación por maternidad: tu sueldo durante la licencia",
      descripcion:
        "Durante los 90 días de licencia la ANSES paga el 100% de tu sueldo (sin tope de IGF). Cómo se tramita, cuándo se cobra y qué pasa con monotributo.",
      bloques: [
        {
          tipo: "p",
          texto:
            "La Asignación por Maternidad es la que financia tu licencia: durante los 90 días, la ANSES te paga una suma igual a tu retribución. No tiene tope de ingreso del grupo familiar y es independiente de la prenatal (que cobrás antes del parto).",
        },
        {
          tipo: "h2",
          texto: "Según tu régimen",
        },
        {
          tipo: "tabla",
          headers: ["Régimen", "Quién te paga la licencia", "Cuánto"],
          filas: [
            ["Relación de dependencia", "ANSES (vía tu empleador)", "100% de tu retribución"],
            ["Monotributo", "ANSES", "Equivale a tus rentas de referencia"],
            ["Casas particulares", "ANSES", "Según tu remuneración registrada"],
          ],
          caption: "Art. 177 LCT y regímenes de ANSES. Sin tope de IGF.",
        },
        {
          tipo: "h2",
          texto: "Cómo se cobra",
        },
        {
          tipo: "ul",
          items: [
            "En relación de dependencia: tu empleador te abona como siempre y luego compensa con ANSES — para vos no cambia nada.",
            "En monotributo: se solicita en ANSES con el certificado de embarazo y se acredita en tu cuenta.",
            "El pago cubre exactamente los 90 días de licencia legal (45+45 o 10+80).",
          ],
        },
        {
          tipo: "p",
          texto:
            "Después de la licencia, si optás por excedencia, esa extensión ya no es paga (es sin goce de sueldo). Los únicos días paga extra son los que suma un parto múltiple según convenio o el art. 208 por enfermedad del embarazo.",
        },
        { tipo: "calc", href: "/asignacion-por-embarazo/", texto: "Ver montos según tu situación" },
      ],
      faqs: [
        {
          pregunta: "¿Incluye aguinaldo y vacaciones?",
          respuesta:
            "La licencia por maternidad es tiempo de servicio: el aguinaldo y las vacaciones se siguen devengando. La suma que paga ANSES equivale a la retribución mensual del período.",
        },
        {
          pregunta: "¿Se cobra si estoy cobrando desempleo?",
          respuesta:
            "No se acumulan: si estás percibiendo la prestación por desempleo y entrás a la licencia, corresponde la Asignación por Maternidad; consultá tu caso en ANSES porque la secuencia importa.",
        },
      ],
      relacionadas: [
        { titulo: "Licencia por maternidad: fechas", href: "/licencia-por-maternidad/" },
        { titulo: "Prenatal: tramos", href: "/guia/prenatal-tramos-igf-cuanto-cobra/" },
      ],
    },
  ];
}
