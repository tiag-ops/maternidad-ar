/** Guía de seguimiento: proyecto de ley de licencias parentales (NO vigente).
 * Esta guía se etiqueta explícitamente como proyecto — el cron semestral
 * chequea el estado y el equipo editorial la actualiza si cambia. */

import { Guia } from "./tipos";

export function guiasProyecto(): Guia[] {
  return [
    {
      slug: "proyecto-ley-licencias-parentales",
      titulo: "Proyecto de ley de licencias parentales: qué propone y en qué está",
      descripcion:
        "El proyecto en el Congreso propone 126 días para la persona gestante y 45 para el no gestante. NO está vigente: acá, qué cambiaría y cómo seguirlo.",
      bloques: [
        {
          tipo: "p",
          texto:
            "Argentina discute desde hace años un reemplazo del esquema actual (90 días gestante + 2 días el otro progenitor) por un régimen de licencias parentales igualitarias. Hay un proyecto presentado en el Congreso con dictamen en comisiones. Importante: NO es ley — nada de lo que describe esta guía se puede exigir hoy a un empleador.",
        },
        {
          tipo: "h2",
          texto: "Qué propone el proyecto",
        },
        {
          tipo: "tabla",
          headers: ["Concepto", "Hoy (vigente)", "Proyecto"],
          filas: [
            ["Persona gestante", "90 días (45+45 u 10+80)", "126 días (45 antes + 81 después)"],
            ["Progenitor no gestante", "2 días corridos", "45 días (o 15 + 30 a repartir en 180 días)"],
            ["Adopción", "Sin licencia específica en LCT", "126 días"],
            ["Parto múltiple", "Según convenio", "+30 días por hijo desde el segundo"],
            ["Prematuros", "Los días previos no gozados se acumulan", "Igual + extensión si hay internación"],
            ["Hijo con discapacidad", "Según convenio", "+180 días de extensión"],
          ],
          caption:
            "Comparativa del proyecto de licencias parentales (Cámara de Diputados) contra el art. 177 vigente. El proyecto no tiene sanción al cierre de esta actualización.",
        },
        {
          tipo: "h2",
          texto: "Por qué importa seguirlo",
        },
        {
          tipo: "ul",
          items: [
            "Cambiaria la matemática de toda planificación familiar: el total pasa de 92 a 171 días entre ambos progenitores.",
            "Introduce la corresponsabilidad real: el no gestante deja de tener 2 días.",
            "Si se aprueba, las calculadoras de este sitio se actualizarían el mismo día — el motor ya está preparado para parametrizar los días.",
          ],
        },
        {
          tipo: "h2",
          texto: "Cómo verificar el estado real",
        },
        {
          tipo: "p",
          texto:
            "El estado oficial de cualquier proyecto se consulta en la web del Congreso (hcdn.gob.ar / senado.gob.ar) buscándolo por su nombre o expediente. Esta página se actualiza cuando hay novedades normativas; el texto vigente de la LCT está verificado contra argentina.gob.ar.",
        },
        { tipo: "calc", href: "/licencia-por-maternidad/", texto: "Calcular con la ley vigente" },
      ],
      faqs: [
        {
          pregunta: "¿Puedo exigir los 126 días ya?",
          respuesta:
            "No. Es un proyecto sin sanción. Lo exigible hoy es el art. 177 vigente: 90 días para la persona gestante y 2 para el no gestante.",
        },
        {
          pregunta: "¿Mi convenio puede dar más días hoy?",
          respuesta:
            "Sí, y varios lo hacen. Los convenios colectivos siempre pueden mejorar los mínimos legales — revisá el tuyo antes de planificar.",
        },
      ],
      relacionadas: [
        { titulo: "Licencia por maternidad (vigente)", href: "/licencia-por-maternidad/" },
        { titulo: "Licencia del padre", href: "/guia/licencia-por-nacimiento-para-el-padre/" },
      ],
    },
  ];
}
