"use client";

import { useState } from "react";
import { montoPrenatal } from "@/lib/asignaciones";
import { formatARS } from "@/lib/format";

/** Calculadora interactiva de prenatal por IGF. Montos server-verificados
 * (el motor usa el mismo JSON oficial que la parte estática). */
export default function PrenatalCliente() {
  const [igf, setIgf] = useState("");
  const [maxIntegrante, setMaxIntegrante] = useState("");

  const igfNum = Number(igf.replace(/[^\d.]/g, ""));
  const maxNum = maxIntegrante ? Number(maxIntegrante.replace(/[^\d.]/g, "")) : undefined;
  const valido = igf !== "" && Number.isFinite(igfNum) && igfNum >= 0;
  const r = valido ? montoPrenatal(igfNum, maxNum) : null;

  return (
    <div className="card">
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="igf">
            Ingreso del grupo familiar por mes (suma de los brutos de quienes trabajan)
          </label>
          <input
            id="igf"
            inputMode="decimal"
            placeholder="Ej: 950000"
            value={igf}
            onChange={(e) => setIgf(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="maxi">Ingreso del integrante que más gana (opcional)</label>
          <input
            id="maxi"
            inputMode="decimal"
            placeholder="Ej: 700000"
            value={maxIntegrante}
            onChange={(e) => setMaxIntegrante(e.target.value)}
            className="input mt-1"
          />
        </div>
      </div>

      {valido && (
        <div aria-live="polite">
          {r ? (
            <div className="verdict">
              <p className="caption mb-1">Asignación prenatal (zona general)</p>
              <p className="numero-resultado">{formatARS(r.monto)}</p>
              <p className="caption mt-2">por mes, en el tramo: {r.tramo}</p>
            </div>
          ) : (
            <div className="warning" role="status">
              Con ese ingreso el grupo familiar queda excluido de las asignaciones familiares
              (supera el tope). La asignación por maternidad durante la licencia, en cambio, no
              tiene tope de ingreso.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
