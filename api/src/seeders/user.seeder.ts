import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../database/entities/user.entity';

const SALT_ROUNDS = 10;

const seedUsers = [
  { email: 'test@example.com', name: 'Test User', password: 'password123', emailVerified: true },
  { email: 'admin@example.com', name: 'Admin User', password: 'admin123', emailVerified: true },
];

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(UserEntity);

    for (const row of seedUsers) {
      const email = row.email.toLowerCase();
      const existing = await repo.findOne({ where: { email } });
      if (existing) {
        console.log(`[UserSeeder] User already exists: ${email}`);
        continue;
      }
      const passwordHash = await bcrypt.hash(row.password, SALT_ROUNDS);
      const user = repo.create({
        email,
        name: row.name,
        passwordHash,
        emailVerified: row.emailVerified,
      });
      await repo.save(user);
      console.log(`[UserSeeder] Created user: ${email}`);
    }
  }
}
