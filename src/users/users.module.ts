import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/users.entity';
import { UserRepository } from './repositories/users.repository';
import { OrganisationModule } from '@app/organisation';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OrganisationModule, 
  ],
  controllers: [UsersController],
  //add rolesrepo
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
