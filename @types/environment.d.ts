declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URL?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_DATABASE?: string;
    DB_DIALECT?: string;
    DB_STORAGE?: string;
  }
}
