import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/users.entity';
import { UserRepository } from './repositories/users.repository';
import { Department, Office, Tesis, Seflik, Mudurluk } from '@app/organisation';
import { Role } from 'src/roles/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Department,
      Office,
      Tesis,
      Seflik,
      Mudurluk,
    ]),
  ],
  controllers: [UsersController],
  //add rolesrepo
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
