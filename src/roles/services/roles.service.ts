import { Injectable } from '@nestjs/common';
import { Role } from '../entities/roles.entity';
import { RolesRepository } from '../repositories/roles.repository';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RolesService {
  //own repository
  constructor(private readonly rolesRepository: RolesRepository) {}

  //to list all roles from the database
  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  //create a role just giving a name in post request
  create(dto: CreateRoleDto) {
    return this.rolesRepository.save(dto.name);
  }

}
