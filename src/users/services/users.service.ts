// src/users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DepartmentRepository } from '@app/organisation/repositories/department.repository';
import { MudurlukRepository } from '@app/organisation/repositories/mudurluk.repository';
import { RolesRepository } from '@app/organisation/repositories/roles.repository';
import { SeflikRepository } from '@app/organisation/repositories/seflik.repository';
import { TesisRepository } from '@app/organisation/repositories/tesis.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RolesRepository,
        private readonly departmentRepository: DepartmentRepository,
        private readonly tesisRepository: TesisRepository,
        private readonly seflikRepository: SeflikRepository,
        private readonly mudurlukRepository: MudurlukRepository,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneById(id: number): Promise<User> {
        return this.userRepository.findOneById(id);
    }

    async create(dto: CreateUserDto): Promise<User> {
        const role = dto.role_id
            ? await this.roleRepository.findById(dto.role_id)
            : undefined;
        const department = dto.department_id
            ? await this.departmentRepository.findById(dto.department_id)
            : undefined;
        const tesis = dto.tesis_id
            ? await this.tesisRepository.findById(dto.tesis_id)
            : undefined;
        const seflik = dto.seflik_id
            ? await this.seflikRepository.findById(dto.seflik_id)
            : undefined;
        const mudurluk = dto.mudurluk_id
            ? await this.mudurlukRepository.findById(dto.mudurluk_id)
            : undefined;

        const user: Partial<User> = {
            sicil_no: dto.sicil_no,
            first_last_name: dto.first_last_name,
            role,
            department,
            tesis,
            seflik,
            mudurluk,
        };

        return this.userRepository.save(user);
    }

    // Excel import için name üzerinden lookup yap
    async resolveIdsFromNames(
        departmentName: string,
        roleName: string,
        tesisName?: string,
        seflikName?: string,
        mudurlukName?: string,
    ) {
        const department =
            await this.departmentRepository.findByName(departmentName);
        const role = await this.roleRepository.findByName(roleName);
        const tesis = tesisName
            ? await this.tesisRepository.findByName(tesisName)
            : null;
        const seflik = seflikName
            ? await this.seflikRepository.findByName(seflikName)
            : null;
        const mudurluk = mudurlukName
            ? await this.mudurlukRepository.findByName(mudurlukName)
            : null;

        return {
            department_id: department?.id,
            role_id: role?.id,
            tesis_id: tesis?.id,
            seflik_id: seflik?.id,
            mudurluk_id: mudurluk?.id,
        };
    }
}