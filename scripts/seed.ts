//bu class seeddeki personel listesini tek seferliğine yüklemek için var.
//upload endpoint kaldırıldı.
//npx ts-node -r tsconfig-paths/register scripts/seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserRepository } from '../src/users/repositories/users.repository';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get(UserRepository);

  const result = await userRepo.importFromExcel('seed/users.xlsx');
  console.log(`Imported ${result.length} users.`);
  await app.close();
}
bootstrap();
