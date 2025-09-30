import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Role } from './entities/roles.entity';
import { RolesRepository } from './repositories/roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  //add rolesrepo
  providers: [RolesService, RolesRepository],
  controllers: [RolesController]
})
export class RolesModule {}
