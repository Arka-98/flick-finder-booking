import { DataSource, type DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['libs/common/src/migrations/*{.ts,.js}'],
};

export default new DataSource(dataSourceOptions);
