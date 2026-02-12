import { DataSource } from 'typeorm';
import 'dotenv/config';

const options = {
  type: 'postgres' as const,
  database: process.env.DATABASE_NAME || 'ecommerce-project-cursor',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  entities: ['dist/**/*.entity{.ts,.js}'],
  seeds: ['dist/seeders/*.seeder{.ts,.js}'],
};

const dataSource = new DataSource(options);
export default dataSource;
