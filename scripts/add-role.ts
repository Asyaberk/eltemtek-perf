//npx ts-node -r tsconfig-paths/register scripts/add-role.ts   
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RolesRepository } from 'libs/organisation/src';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesRepo = app.get(RolesRepository);

  const roleName = 'İnsan Kaynakları';
  const existing = await rolesRepo.findByName(roleName);
  if (existing) {
    console.log(`Role '${roleName}' already exists.`);
  } else {
    await rolesRepo.save(roleName);
    console.log(`✅ Role '${roleName}' added successfully!`);
  }

  await app.close();
}
bootstrap();
