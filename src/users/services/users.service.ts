// src/users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { UserRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from 'src/roles/entities/roles.entity';
import { Department, Office, Tesis, Seflik, Mudurluk } from '@app/organisation';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Department)
        private readonly deptRepo: Repository<Department>,
        @InjectRepository(Office) private readonly officeRepo: Repository<Office>,
        @InjectRepository(Tesis) private readonly tesisRepo: Repository<Tesis>,
        @InjectRepository(Seflik) private readonly seflikRepo: Repository<Seflik>,
        @InjectRepository(Mudurluk) private readonly mudRepo: Repository<Mudurluk>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneById(id: number): Promise<User> {
        return this.userRepository.findOneById(id);
    }

    async create(dto: CreateUserDto): Promise<User> {
        const role = await this.roleRepo.findOneByOrFail({ id: dto.role_id });
        const department = await this.deptRepo.findOneByOrFail({
            id: dto.department_id,
        });

        const office = dto.office_id
            ? await this.officeRepo.findOneByOrFail({ id: dto.office_id })
            : undefined;
        const tesis = dto.tesis_id
            ? await this.tesisRepo.findOneByOrFail({ id: dto.tesis_id })
            : undefined;
        const seflik = dto.seflik_id
            ? await this.seflikRepo.findOneByOrFail({ id: dto.seflik_id })
            : undefined;
        const mudurluk = dto.mudurluk_id
            ? await this.mudRepo.findOneByOrFail({ id: dto.mudurluk_id })
            : undefined;

        const user: Partial<User> = {
            sicil_no: dto.sicil_no,
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            password: dto.password ?? undefined,
            role,
            department,
            office,
            tesis,
            seflik,
            mudurluk,
        };

        return this.userRepository.save(user);
    }
}
