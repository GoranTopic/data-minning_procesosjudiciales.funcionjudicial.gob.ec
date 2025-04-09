// API Types
export interface SearchQuery {
  numeroCausa: string;
  actor: {
    cedulaActor: string;
    nombreActor: string;
  };
  demandado: {
    cedulaDemandado: string;
    nombreDemandado: string;
  };
  provincia: string;
  numeroFiscalia: string;
  recaptcha: string;
}

export interface Causa {
  idJuicio: string;
  nombreDelito?: string;
  nombreJudicatura?: string;
  fechaIngreso?: string;
  [key: string]: any; // For other properties that might be present
}

export interface Incidente {
  idMovimientoJuicioIncidente?: number;
  idJuicio?: string;
  idJudicatura?: string;
  idIncidenteJudicatura?: number;
  aplicativo?: string;
  nombreJudicatura?: string;
  [key: string]: any; // For other properties that might be present
}

export interface CausaScraped {
  id: string;
  causa: Causa;
}

// Proxy and User Agent Types
export interface Proxy {
  ip: string;
  port: number;
  [key: string]: any;
}

// Storage Types
export interface StorageOptions {
  type: string;
  url: string;
  database: string;
}

export interface Store {
  push: (data: any) => Promise<void>;
  get: (query: any) => Promise<any[]>;
  close: () => Promise<void>;
}

// Checklist Types
export interface ChecklistOptions {
  name: string;
  path: string;
  recalc_on_check: boolean;
  save_every_check: number;
}

export interface Checklist {
  next: () => string | undefined;
  check: (value: string) => void;
  isDone: () => boolean;
  delete: () => void;
  valuesDone: () => number;
  valuesCount: () => number;
}

// Captcha Types
export interface CaptchaOptions {
  checkEvery?: number;
  timeout?: number;
  submitEndpoint?: string;
  checkEndpoint?: string;
  debug?: boolean;
}

// Timer Types
export interface TimerRange {
  minSeconds: number;
  maxSeconds: number;
}

// Logger Type
export type LogFunction = (message: string) => void;
