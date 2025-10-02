import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { DepartmentRepository } from './repositories/department.repository';
import { MudurlukRepository } from './repositories/mudurluk.repository';
import { RolesRepository } from './repositories/roles.repository';
import { SeflikRepository } from './repositories/seflik.repository';
import { TesisRepository } from './repositories/tesis.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Mudurluk } from './entities/mudurluk.entity';
import { Role } from './entities/roles.entity';
import { Seflik } from './entities/seflik.entity';
import { Tesis } from './entities/tesis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Mudurluk, Role, Seflik, Tesis]), 
  ],

  providers: [
    OrganisationService,
    DepartmentRepository,
    TesisRepository,
    SeflikRepository,
    MudurlukRepository,
    RolesRepository,
  ],
  exports: [
    OrganisationService,
    DepartmentRepository,
    TesisRepository,
    SeflikRepository,
    MudurlukRepository,
    RolesRepository,
  ],
})
export class OrganisationModule {}
