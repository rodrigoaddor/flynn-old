import { Sequelize, Options, Dialect } from 'sequelize';

const { DB_URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DIALECT, DB_STORAGE } = process.env;

const dialects = ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'];
const isDialect = (dialect: string = ''): dialect is Dialect => dialects.includes(dialect);

const sequelizeOptions: Options = {
  host: DB_HOST,
  port: DB_PORT ? +DB_PORT : undefined,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  dialect: isDialect(DB_DIALECT) ? DB_DIALECT : undefined,
  storage: DB_STORAGE,
  logging: false,
};

export const db = DB_URL ? new Sequelize(DB_URL, sequelizeOptions) : new Sequelize(sequelizeOptions);
