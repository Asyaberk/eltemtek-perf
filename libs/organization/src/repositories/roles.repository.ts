import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@app/organisation/entities/roles.entity';

@Injectable()
// Custom role repository
export class RolesRepository {
  // Injecting repository to avoid raw SQL and ensure safety
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async find(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findById(id: number): Promise<Role> {
    return this.roleRepo.findOneByOrFail({ id });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { name } });
  }
    
  async save(name: string): Promise<Role> {
    //check if role name exists(for the safety of the name 'admin')
    const existing = await this.roleRepo.findOne({ where: { name } });
    if (existing) {
      throw new BadRequestException(`Role '${name}' already exists!`);
    }

    //then create new
    const newRole = this.roleRepo.create({ name });
    return this.roleRepo.save(newRole);
  }
}
