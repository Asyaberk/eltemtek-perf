import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as bcrypt from 'bcrypt';
import {
  RolesRepository,
  DepartmentRepository,
  TesisRepository,
  SeflikRepository,
  MudurlukRepository,
} from 'libs/organisation/src';
import { UserRepository } from '../src/users/repositories/users.repository';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get(UserRepository);
  const roleRepo = app.get(RolesRepository);
  const departmentRepo = app.get(DepartmentRepository);
  const tesisRepo = app.get(TesisRepository);
  const seflikRepo = app.get(SeflikRepository);
  const mudurlukRepo = app.get(MudurlukRepository);

  const sicil_no = 'IK101';
  const existingUser = await userRepo.findOneBySicilNo(sicil_no);

  if (existingUser) {
    console.log(`User with sicil_no '${sicil_no}' already exists.`);
    await app.close();
    return;
  }

  const hashedPassword = await bcrypt.hash('1', 10);

  const role = await roleRepo.findById(19);
  const department = await departmentRepo.findById(21);
  const tesis = await tesisRepo.findById(1);
  const seflik = await seflikRepo.findById(12);
  const mudurluk = await mudurlukRepo.findById(4);

  const newUser = await userRepo.save({
    sicil_no,
    first_last_name: 'İnan Kaynak',
    password: hashedPassword,
    role,
    department,
    tesis,
    seflik,
    mudurluk,
  });

  console.log('✅ İnsan Kaynakları kullanıcısı başarıyla eklendi:', newUser);
  await app.close();
}

bootstrap();
