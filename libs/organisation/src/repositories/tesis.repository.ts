import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tesis } from '../entities/tesis.entity';

@Injectable()
export class TesisRepository {
    constructor(
        @InjectRepository(Tesis) private readonly tesisRepo: Repository<Tesis>,
    ) { }

    async findByName(tesis_name: string): Promise<Tesis | null> {
        return this.tesisRepo.findOne({ where: { tesis_name } });
    }
    
    async findById(id: number): Promise<Tesis> {
        return this.tesisRepo.findOneByOrFail({ id });
    }
}
