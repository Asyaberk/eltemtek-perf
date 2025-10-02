import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentRepository {
    constructor(
        @InjectRepository(Department)
        private readonly deptRepo: Repository<Department>,
    ) { }

    async findByName(name: string): Promise<Department | null> {
        return this.deptRepo.findOne({ where: { department_name: name } });
    }
    
    async findById(id: number): Promise<Department> {
        return this.deptRepo.findOneByOrFail({ id });
    }
}
