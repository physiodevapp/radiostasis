/**
 * Tipos del motor genérico. Un tema (hipertensión, natremia…) es un objeto
 * `Modelo` con nodos, relaciones y casos: datos puros, sin lógica de interfaz.
 */

/** Escala de tiempo del interruptor de tres posiciones (decisión O6). */
export type Escala = 'minutos' | 'dias' | 'estable';

/**
 * Momento de una sesión de ejercicio (fase 5). «antes» es el paciente en reposo
 * (la simulación de siempre); «durante» y «al terminar» se calculan sobre su
 * estado estable (ver `simular`).
 */
export type Momento = 'antes' | 'durante' | 'despues';

/**
 * `farmaco`: modificador (fase 4); como las causas, lo fija el usuario con su rueda de dosis.
 * `ejercicio`: modificador (fase 5), con su rueda de intensidad (sesión) o de entrenamiento.
 */
export type TipoNodo = 'causa' | 'farmaco' | 'ejercicio' | 'mecanismo' | 'salida' | 'analitica';

/**
 * - `suma`: tanh de la suma ponderada de las entradas (lo normal).
 * - `acumulador`: integra entradas menos salidas en el tiempo (volemia).
 * - `derivado`: fórmula de otros nodos (PAM).
 * - `entrada`: lo fija el usuario (las causas y la dosis de los fármacos).
 */
export type Calculo = 'suma' | 'acumulador' | 'derivado' | 'entrada';

export type Frecuencia = 'comun' | 'poco_frecuente' | 'rara';

export interface Nodo {
  id: string;
  /** Código del documento del modelo (C1, M4, S6, A1…). */
  codigo: string;
  nombre: string;
  tipo: TipoNodo;
  calculo: Calculo;
  /** Rango del valor; 0 = normal. */
  rango: [number, number];
  /** Texto de los extremos de la rueda (mínimo, máximo). */
  etiquetas?: [string, string];
  frecuencia?: Frecuencia;
  /**
   * Solo causas bipolares cuyo extremo cambia la frecuencia: [lado mínimo, lado
   * máximo]. Con la rueda en 0 vale `frecuencia`. (ADH autónoma: diabetes
   * insípida rara, SIADH poco frecuente.)
   */
  frecuenciaExtremos?: [Frecuencia, Frecuencia];
  /**
   * Texto del valor de la rueda por tramos: [desde, texto], de menor a mayor
   * (fase 5: «reposo», «suave», «moderada», «vigorosa»).
   */
  niveles?: [number, string][];
  /**
   * Fase 7: variantes discretas de una causa (estenosis bilateral, unilateral o
   * de riñón único). La primera es la de siempre: la que vale si no se elige otra.
   */
  variantes?: Variante[];
  /** Solo `derivado`: pesos de la combinación lineal de otros nodos. */
  formula?: Record<string, number>;
  explicacion?: string;
}

/** Variante de una causa (fase 7). */
export interface Variante {
  id: string;
  /** Nombre del botón («Unilateral»). */
  nombre: string;
  /** Texto corto para la placa y los chips («unilateral»). */
  corto: string;
}

/** Variante elegida de cada causa que las tiene (las que faltan, la primera). */
export type Variantes = Record<string, string>;

/** Intensidades con nombre del documento del modelo. */
export const INTENSIDAD = { debil: 0.3, moderada: 0.6, fuerte: 1.0 } as const;

export type Signo = '+' | '-';

interface RelacionBase {
  /** Número de la relación en el documento del modelo. */
  n: number;
  origen: string;
  destino: string;
  explicacion: string;
  /** «PubMed»: la respaldan los artículos de `pmid` (ver docs/fuentes.md). Un test exige PMID en todas las relaciones del tema. */
  fuente: string;
  /**
   * Fármacos que la cortan (nombres, como documentación). Un test comprueba que
   * coinciden con las relaciones `bloquea` del tema.
   */
  bloqueable?: string[];
  /**
   * Fase 5: la relación solo actúa en ese momento de una sesión de ejercicio
   * («durante» o «despues»). Sin momento, actúa siempre.
   */
  momento?: Exclude<Momento, 'antes'>;
  /** Fuentes bibliográficas (PMID), si las hay. */
  pmid?: string[];
  /**
   * Fase 7: la relación depende de la variante de una causa. Con `solo`, solo
   * actúa en esas variantes; con `intensidad`, cambia su peso en esas variantes.
   */
  variante?: { nodo: string; solo?: string[]; intensidad?: Record<string, number> };
}

export interface RelacionSuma extends RelacionBase {
  tipo: 'suma';
  signo: Signo;
  /** Peso cuando el origen está por encima de 0 (o siempre, si no hay `intensidadNegativa`). */
  intensidad: number;
  /** Peso cuando el origen está por debajo de 0, si difiere. */
  intensidadNegativa?: number;
  /**
   * El efecto empieza cuando el origen pasa de este valor. Con umbral negativo
   * actúa por debajo (TFG < −0,3); la entrada efectiva es (origen − umbral).
   */
  umbral?: number;
  /** Escala más corta en la que ya actúa. */
  tiempo: Escala;
  /** Última escala en la que actúa (65: el barorreflejo no actúa en estado estable). */
  hasta?: Escala;
}

/** El origen multiplica el efecto de otras relaciones por (1 + origen). */
export interface RelacionModula extends RelacionBase {
  tipo: 'modula';
  /** Números de las relaciones moduladas. */
  relaciones: number[];
  /**
   * Revisión del modelo (17 nov 2026): con signo «-», el origen atenúa las
   * relaciones moduladas en lugar de reforzarlas. Factor = máx(0, 1 ± intensidad × origen).
   * Sin signo ni intensidad, «+» y 1, como antes.
   */
  signo?: Signo;
  intensidad?: number;
}

/** Fuera de 0, el origen anula el valor del destino y lo sustituye. */
export interface RelacionFija extends RelacionBase {
  tipo: 'fija';
}

/**
 * Modificador (fase 4): el origen es un fármaco con dosis de 0 a 1 que bloquea
 * otras relaciones. Con bloqueo b = dosis × `maximo` (varios fármacos sobre la
 * misma relación se suman, hasta 1), la relación bloqueada ve su origen como
 * (1 + x)(1 − b) − 1: se corta también el tono normal de la vía, no solo la
 * desviación. Si el origen bloqueado es una causa (sin tono normal), solo se
 * recorta la desviación: x (1 − b).
 * `destino` es el nodo donde se nota el bloqueo (para la vista y la ficha).
 */
export interface RelacionBloquea extends RelacionBase {
  tipo: 'bloquea';
  /** Números de las relaciones bloqueadas. */
  relaciones: number[];
  /** Fracción bloqueada con la dosis plena (0–1). */
  maximo: number;
  /**
   * Fase 5: solo recorta la desviación del origen por encima de lo normal,
   * x (1 − b) si x > 0, sin cortar el tono normal (el entrenamiento atenúa el
   * exceso de una vía, no la vía).
   */
  soloExceso?: boolean;
}

export type Relacion = RelacionSuma | RelacionModula | RelacionFija | RelacionBloquea;

export type Flecha = '↓↓' | '↓' | '=' | '↑' | '↑↑';

/** Resultado esperado: una flecha o varias aceptables («= o ↑ leve»). */
export type Esperado = Flecha | Flecha[];

export interface Expectativa {
  escala: Escala;
  /** Fase 5: momento de la sesión de ejercicio (sin él, «antes»: la simulación de siempre). */
  momento?: Momento;
  /** Causas que cambian respecto al caso base («sin acceso al agua»). */
  ajustes?: Record<string, number>;
  /** Texto de la condición, tal como aparece en la tabla. */
  condicion?: string;
  valores: Record<string, Esperado>;
  /**
   * Resultados de la tabla que el modelo no puede cumplir sin una decisión de
   * Edu (no basta con las intensidades): nodo → motivo. Sus tests quedan
   * omitidos y se listan como pendientes.
   */
  pendientes?: Record<string, string>;
}

export interface Caso {
  id: number;
  nombre: string;
  causas: Record<string, number>;
  /** Dosis de los fármacos (fase 4); los que faltan, a 0. */
  farmacos?: Record<string, number>;
  /** Ejercicio (fase 5): intensidad de la sesión y entrenamiento; los que faltan, a 0. */
  ejercicio?: Record<string, number>;
  /** Momento de la sesión con que se abre el caso (por defecto, «antes»). */
  momento?: Momento;
  /** Fase 7: variantes de las causas (las que faltan, la primera). */
  variantes?: Variantes;
  /** Resultados esperados: el primero es el de estado estable de la tabla. */
  esperado: Expectativa[];
  nota?: string;
}

export interface Modelo {
  id: string;
  nombre: string;
  nodos: Nodo[];
  relaciones: Relacion[];
  casos: Caso[];
  /** Parámetros numéricos del motor para este tema. */
  parametros: ParametrosMotor;
  /** Avisos de realismo (docs/modelo-v2.1.md): textos y reglas del tema. */
  avisos?: AvisosTema;
}

/**
 * Avisos de realismo: las ruedas se giran por separado y permiten pacientes que
 * no existen. El simulador no lo prohíbe, pero lo avisa. Todo son datos del tema.
 */
export interface AvisosTema {
  /** Qué mide la frecuencia (título de la pastilla y nota de la ficha). */
  queMideFrecuencia: string;
  /** Textos de la frecuencia (las causas comunes no llevan). */
  frecuencia: Record<Exclude<Frecuencia, 'comun'>, {
    /** Pastilla del mando («causa rara», «poco frecuente»). */
    pastilla: string;
    /** Chip de la banda («Regaliz · causa poco frecuente»). */
    chip: string;
    /** Varias causas con la misma frecuencia («causas raras»). */
    plural: string;
  }>;
  /** Una causa cuenta como activa desde este valor absoluto. */
  causaActiva: number;
  hipotetica: {
    titulo: string;
    texto: string;
    /** Salta con este número de causas raras activas… */
    minRaras: number;
    /** …o con este número de causas no comunes (raras o poco frecuentes). */
    minNoComunes: number;
  };
  /** Fase 7: variante de siempre de cada causa que las tiene (la primera de su nodo; un test lo vigila). */
  variantesPorDefecto?: Variantes;
  /** Interacciones de fármacos con causas o entre sí (fase 4). */
  interacciones?: Interaccion[];
  /** Notas de interacción entre causas activas (fase 6): cuentan cómo se combinan, no avisan de un riesgo. */
  notas?: Interaccion[];
  fueraDeRango: {
    /** Texto del chip. */
    etiqueta: string;
    /** Explicación completa (título del chip y lector de pantalla). */
    texto: string;
    /** Valor absoluto desde el que se considera saturado. */
    umbral: number;
    /** Nodos vigilados: salidas y valores de analítica. */
    nodos: string[];
  };
}

/**
 * Aviso de interacción (fase 4): salta cuando están activas todas las entradas
 * de `todas`, al menos una de `alguna` (si la hay) y ninguna de `ninguna`.
 * Una entrada (causa o fármaco) cuenta como activa desde `causaActiva`.
 */
export interface Interaccion {
  id: string;
  /** Gravedad: «contraindicado» o «precaución»; «nota» en las notas entre causas (fase 6). */
  nivel: 'contraindicado' | 'precaucion' | 'nota';
  titulo: string;
  texto: string;
  todas: string[];
  alguna?: string[];
  ninguna?: string[];
  /** Además, al menos una de estas (fase 5: un fármaco y una sesión de ejercicio). */
  requiere?: string[];
  /** Fase 5: solo salta en estos momentos de la sesión de ejercicio. */
  momentos?: Momento[];
  /** Fase 6: extremo de la rueda que cuenta (1, el positivo; -1, el negativo), p. ej. sal alta o baja. */
  signo?: Record<string, 1 | -1>;
  /** Fase 6: fuentes de la nota (PMID y DOI), para la documentación y la revisión. */
  fuentes?: string[];
  /** Fase 7: solo salta con estas variantes de la causa (nodo → variantes). */
  variantes?: Record<string, string[]>;
}

export interface ParametrosMotor {
  /** Amortiguación de los nodos rápidos en cada iteración (0–1). */
  amortiguacion: number;
  /** Paso de integración de los acumuladores por iteración. */
  paso: number;
  /** Tiempo integrado en la escala «días» (en unidades del paso). */
  horizonteDias: number;
  /** Tolerancia de convergencia. */
  tolerancia: number;
  /** Iteraciones máximas. */
  maxIteraciones: number;
}

export type Estado = Record<string, number>;

/**
 * Reto (fase 6, modo reto): un paciente con las causas ocultas. El estudiante
 * deduce cuáles son a partir de la presión, los mecanismos y la analítica.
 */
export interface Reto {
  id: number;
  /** Una causa, dos causas o una causa con un fármaco ya puesto. */
  nivel: 'una' | 'dos' | 'farmaco';
  causas: Record<string, number>;
  /** Fármacos que ya toma el paciente (se ven en su pestaña). */
  farmacos?: Record<string, number>;
  /** Fase 7: variantes de las causas (las que faltan, la primera). */
  variantes?: Variantes;
  enunciado: string;
  /** Pistas que se destapan una a una. */
  pistas: string[];
  /** «Lo que lo delataba», al corregir. */
  delata: string[];
  /** Flechas en estado estable que delatan la causa: se marcan al corregir y los tests las vigilan. */
  claves: Record<string, Flecha>;
  /**
   * Retos por enlace: el reto lo ha hecho un profesor con «Compartir». Lleva su
   * explicación al corregir y puede llevar ejercicio, momento y escala; las
   * claves y la pista salen del modelo al abrirlo.
   */
  profesor?: {
    explicacion: string;
    ejercicio: Record<string, number>;
    momento: Momento;
    escala: Escala;
  };
}

export interface CorreccionReto {
  resultado: 'acierto' | 'parcial' | 'fallo';
  aciertos: string[];
  /** Elegidas que no son causas del reto. */
  sobran: string[];
  /** Causas del reto que no se eligieron. */
  faltan: string[];
}
