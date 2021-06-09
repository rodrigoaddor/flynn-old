import { Sequelize, Options, Dialect } from 'sequelize';

const dialects = ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'];
const isDialect = (dialect: string = ''): dialect is Dialect => dialects.includes(dialect);

const getOptionsFromEnv = (): Options => {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DIALECT, DB_STORAGE } = process.env;

  return {
    host: DB_HOST,
    port: DB_PORT ? +DB_PORT : undefined,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    dialect: isDialect(DB_DIALECT) ? DB_DIALECT : undefined,
    storage: DB_STORAGE,
    logging: false,
  };
};

export const validateOptions = (): true | string[] => {
  const options = getOptionsFromEnv();
  const required: (keyof Options)[] = ['dialect'];
  const invalid = [];

  for (const field of required) {
    if (options[field] === undefined) {
      invalid.push(field);
    }
  }

  return invalid.length > 0 ? invalid : true;
};

export const initialize = () => {
  const options = getOptionsFromEnv();
  const { DB_URL } = process.env;

  if (DB_URL) {
    return new Sequelize(DB_URL, options);
  } else {
    return new Sequelize(options);
  }
};
