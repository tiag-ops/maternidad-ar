/** Fetcher mensual de montos ANSES — cero dependencias (Node 22, fetch nativo).
 *
 * Fuente: https://www.anses.gob.ar/montos-de-asignacion-universal-por-hijo-y-por-embarazo-para-proteccion-social
 * (intento directo con UA de navegador; si el sitio filtra, via Jina Reader).
 *
 * Actualiza en src/data/anses.json: aue, auh (+ discapacidad), aumento, vigenciaDesde,
 * actualizadoEl. La cartilla de asignaciones familiares (nacimiento/adopción/prenatal/topes)
 * se intenta parsear; si falla, se conservan los valores anteriores y se avisa por stdout.
 *
 * Salida:
 *  - exit 0: OK (con o sin cambios). Imprime "CHANGES: yes|no" y warnings si los hay.
 *  - exit 1: fallo de fetch/parse total — NO se escribe nada.
 *
 * Regla de oro: nunca escribir un JSON que no pase las validaciones de invariantes. */

import { readFileSync, writeFileSync } from "node:fs";

const URL_MONTO =
  "https://www.anses.gob.ar/montos-de-asignacion-universal-por-hijo-y-por-embarazo-para-proteccion-social";
const ARCHIVO = new URL("../src/data/anses.json", import.meta.url);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "$120.678,40" → 120678.4 | "$510.820" → 510820 */
function arToNumber(s) {
  const limpio = s.replace(/\$/g, "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(limpio);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`Monto no parseable: "${s}"`);
  return n;
}

async function fetchText(url, timeoutMs = 30000, { bare = false } = {}) {
  let urlActual = url;
  for (let salto = 0; salto < 5; salto++) {
    const res = await fetch(urlActual, {
      headers: bare
        ? {}
        : { "User-Agent": UA, "Accept-Language": "es-AR,es;q=0.9", Accept: "text/html,*/*" },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "manual",
    });
    // 3xx: seguir manualmente (Node fetch no sigue cross-origin)
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error(`Redirect sin location (${res.status})`);
      urlActual = new URL(loc, urlActual).href;
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${urlActual}`);
    const body = await res.text();
    // ANSES sirve el sitio dentro de un iframe anti-bot: la página real está
    // en el atributo src. Si lo detectamos, seguimos ese hop manualmente.
    const iframeSrc = body.match(/<iframe[^>]+id="[^"]*"[^>]+src="([^"]+)"/i)?.[1] ??
      body.match(/<iframe[^>]+src="([^"]+)"/i)?.[1];
    if (iframeSrc && body.length < 3000) {
      console.log(`iframe anti-bot detectado → siguiendo hop a ${iframeSrc.slice(0, 60)}…`);
      urlActual = new URL(iframeSrc, urlActual).href;
      continue;
    }
    return body;
  }
  throw new Error("Demasiados saltos de redirección/iframe");
}

/** Convierte HTML crudo a texto con filas pipe ("| celda | celda |") para que
 * el parser único funcione igual sobre HTML directo que sobre markdown de Jina. */
function htmlATablas(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/[ \t]{2,}/g, " ");
}

/** Trae la página: directo primero (normalizando HTML); si no aparece la tabla,
 * vía Jina Reader. Devuelve SIEMPRE texto normalizado con filas pipe. */
async function traerPagina(url) {
  const intentos = [
    { nombre: "directo", fn: () => fetchText(url) },
    { nombre: "jina", fn: () => fetchText(`https://r.jina.ai/${url}`, 90000, { bare: true }) },
  ];
  for (const { nombre, fn } of intentos) {
    try {
      const bruto = await fn();
      const texto = htmlATablas(bruto);
      // El parser de abajo depende de filas pipe con estos montos.
      if (texto.includes("| Asignación Universal por Hijo (80%) |")) {
        console.log(`fuente OK vía ${nombre}`);
        return texto;
      }
      console.warn(`vía ${nombre}: respondió pero sin la tabla esperada`);
    } catch (e) {
      console.warn(`vía ${nombre} falló: ${e.message}`);
    }
  }
  return null;
}

/** Extrae una fila de la tabla markdown "| Etiqueta | zona general | austral |". */
function fila(html, etiqueta) {
  const re = new RegExp(
    `\\|\\s*${etiqueta}\\s*\\|\\s*([^|]+)\\|\\s*([^|]+)\\|`,
    "i",
  );
  const m = html.match(re);
  if (!m) throw new Error(`No encontré la fila "${etiqueta}"`);
  return { general: arToNumber(m[1]), austral: arToNumber(m[2]) };
}

/** Intento de cartilla (nacimiento, adopción, topes). Null si no sale limpia. */
function intentarCartilla(html) {
  try {
    const topeIgf = arToNumber(html.match(/Tope máximo de Ingreso del Grupo Familiar\s*\$\s*([\d.]+)/)?.[1] ?? "");
    const topeIntegrante = arToNumber(
      html.match(/Tope máximo de cada integrante del Grupo Familiar\s*\$\s*([\d.]+)/)?.[1] ?? "",
    );
    const nac = arToNumber(html.match(/NACIMIENTO[\s\S]{0,200}?IGF hasta \$ [\d.]+\s+\$\s*([\d.]+)/)?.[1] ?? "");
    const adop = arToNumber(html.match(/ADOPCIÓN[\s\S]{0,200}?IGF hasta \$ [\d.]+\s+\$\s*([\d.]+)/)?.[1] ?? "");
    // invariantes de cordura
    if (!(nac > 20000 && nac < 5_000_000)) throw new Error(`nacimiento fuera de rango: ${nac}`);
    if (!(adop > nac)) throw new Error(`adopción (${adop}) debe superar nacimiento (${nac})`);
    if (!(topeIntegrante < topeIgf)) throw new Error("topes inconsistentes");
    return {
      nacimiento: { monto: nac },
      adopcion: { monto: adop },
      topes: { igfMaximo: topeIgf, integranteMaximo: topeIntegrante },
    };
  } catch (e) {
    console.warn(`cartilla no parseable (se conservan valores anteriores): ${e.message}`);
    return null;
  }
}

const actual = JSON.parse(readFileSync(ARCHIVO, "utf-8"));
const hoy = new Date().toISOString().slice(0, 10);

const html = await traerPagina(URL_MONTO);
if (!html) throw new Error("Ninguna fuente de montos respondió con la tabla esperada");

// mes de vigencia: el encabezado de la tabla trae "| Agosto | ..."; fallback: mes actual
const mesTabla = html.match(/^\|\s*(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)\s*\|/im)?.[1];
const mesNombre = (mesTabla ?? MESES[new Date().getUTCMonth()]).toLowerCase();
const mesNumero = MESES.indexOf(mesNombre) + 1;
const anioVigencia = new Date().getUTCFullYear();
const vigenciaDesde = `${anioVigencia}-${String(mesNumero).padStart(2, "0")}-01`;

const auh80 = fila(html, "Asignación Universal por Hijo \\(80%\\)");
const auh20 = fila(html, "Complemento Asignación Universal por Hijo \\(20%\\)");
const auhDis80 = fila(html, "Asignación Universal por Hijo con discapacidad \\(80%\\)");
const auhDis20 = fila(html, "Complemento Asignación Universal por Hijo con discapacidad \\(20%\\)");
const aue80 = fila(html, "Asignación por Embarazo \\(80%\\)");
const aue20 = fila(html, "Complemento Asignación por Embarazo \\(20%\\)");
const aumentoTxt = html.match(/\|\s*Aumento\s*\|\s*([\d,]+)%\s*\|/)?.[1];
const aumento = aumentoTxt ? Number(aumentoTxt.replace(",", ".")) : null;
if (!Number.isFinite(aumento) || aumento < 0 || aumento > 50) {
  throw new Error(`Aumento mensual no plausible: ${aumentoTxt}`);
}

function bloqueUniversal(p80, p20, etiqueta) {
  const total = p80.general + p20.general;
  const totalAustral = p80.austral + p20.austral;
  // invariantes: total plausible y consistencia 80+20=total
  if (!(total > 50000 && total < 50_000_000)) throw new Error(`${etiqueta}: total implausible ${total}`);
  return {
    pagoMensual80: p80.general,
    complemento20: p20.general,
    totalMes: Number(total.toFixed(2)),
    zonaAustral: {
      pagoMensual80: p80.austral,
      complemento20: p20.austral,
      totalMes: Number(totalAustral.toFixed(2)),
    },
  };
}

const nuevo = {
  ...actual,
  vigenciaDesde,
  actualizadoEl: hoy,
  aumento: { porcentaje: aumento, mes: `${mesNombre} ${anioVigencia}` },
  aue: { nombre: actual.aue.nombre, ...bloqueUniversal(aue80, aue20, "AUE") },
  auh: {
    nombre: actual.auh.nombre,
    ...bloqueUniversal(auh80, auh20, "AUH"),
    conDiscapacidad: {
      ...bloqueUniversal(auhDis80, auhDis20, "AUH-discapacidad"),
    },
  },
};

const cartilla = intentarCartilla(html);
const warnings = [];
if (cartilla) {
  nuevo.nacimiento = { ...actual.nacimiento, ...cartilla.nacimiento };
  nuevo.adopcion = { ...actual.adopcion, ...cartilla.adopcion };
  nuevo.topes = { ...actual.topes, ...cartilla.topes };
} else {
  // La cartilla vive en otra página: segundo intento best-effort con la misma pipeline.
  const URL_CARTILLA =
    "https://www.anses.gob.ar/cartilla/montos-asignaciones-familiares";
  const htmlCartilla = await traerPaginaCartilla(URL_CARTILLA);
  if (htmlCartilla) {
    const c2 = intentarCartilla(htmlCartilla);
    if (c2) {
      nuevo.nacimiento = { ...actual.nacimiento, ...c2.nacimiento };
      nuevo.adopcion = { ...actual.adopcion, ...c2.adopcion };
      nuevo.topes = { ...actual.topes, ...c2.topes };
    } else {
      warnings.push("cartilla (nacimiento/adopción/topes) sin actualizar: fuente no parseable este mes");
    }
  } else {
    warnings.push("cartilla (nacimiento/adopción/topes) sin actualizar: página no accesible este mes");
  }
}

/** Igual que traerPagina pero exige el marcador de la cartilla. */
async function traerPaginaCartilla(url) {
  const intentos = [
    { nombre: "directo", fn: () => fetchText(url) },
    { nombre: "jina", fn: () => fetchText(`https://r.jina.ai/${url}`, 90000, { bare: true }) },
  ];
  for (const { nombre, fn } of intentos) {
    try {
      const texto = htmlATablas(await fn());
      if (texto.includes("NACIMIENTO") && texto.includes("Tope máximo")) {
        console.log(`cartilla OK vía ${nombre}`);
        return texto;
      }
      console.warn(`cartilla vía ${nombre}: sin marcadores esperados`);
    } catch (e) {
      console.warn(`cartilla vía ${nombre} falló: ${e.message}`);
    }
  }
  return null;
}

// sanity final: nada quedó undefined/NaN
const jsonNuevo = JSON.stringify(nuevo, null, 2) + "\n";
if (/NaN|undefined/.test(jsonNuevo)) throw new Error("El JSON resultante contiene NaN/undefined");

/** Comparación canónica: claves ordenadas recursivamente + fecha fuera. Así un
 * re-ordenamiento o el cambio de `actualizadoEl` no dispara un PR falso. */
function canon(x) {
  if (x === null || typeof x !== "object") return x;
  if (Array.isArray(x)) return x.map(canon);
  return Object.fromEntries(
    Object.keys(x)
      .sort()
      .map((k) => [k, canon(x[k])]),
  );
}
const cambioReal =
  JSON.stringify(canon({ ...actual, actualizadoEl: null })) !==
  JSON.stringify(canon({ ...nuevo, actualizadoEl: null }));

if (!cambioReal) {
  console.log("CHANGES: no");
  console.log(`verificado contra fuente oficial: vigencia ${vigenciaDesde}, AUE total ${nuevo.aue.totalMes}`);
} else {
  writeFileSync(ARCHIVO, jsonNuevo);
  console.log("CHANGES: yes");
  console.log(`vigenciaDesde: ${actual.vigenciaDesde} → ${vigenciaDesde}`);
  console.log(`AUE total: ${actual.aue.totalMes} → ${nuevo.aue.totalMes}`);
  console.log(`AUH total: ${actual.auh.totalMes} → ${nuevo.auh.totalMes}`);
}
for (const w of warnings) console.log(`WARNING: ${w}`);
