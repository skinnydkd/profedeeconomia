/** KPI map: keyed by metric id (e.g. "caja", "satisfaccion"). Values are numbers. */
export type Kpis = Record<string, number>;

/** A single user-facing option on a decision node. */
export interface Opcion {
  label: string;
  /** Per-KPI delta applied when this option is chosen. */
  kpi_delta: Partial<Kpis>;
  /** Pedagogical paragraph shown after the user picks this option. */
  feedback: string;
  /** Id of the next node OR special string "final:exito"/"final:fracaso_parcial". */
  next: string;
}

export interface Nodo {
  titulo: string;
  situacion: string;
  opciones: Opcion[];
}

export interface Final {
  titulo: string;
  resumen: string;
  lecciones_clave: string[];
}

export interface ArbolJSON {
  intro: {
    kicker: string;
    titulo: string;
    contexto: string;
    kpi_inicial: Kpis;
  };
  nodes: Record<string, Nodo>;
  finales: Record<string, Final>;
}
