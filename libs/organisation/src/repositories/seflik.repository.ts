import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seflik } from '../entities/seflik.entity';

@Injectable()
export class SeflikRepository {
  constructor(
    @InjectRepository(Seflik) private readonly seflikRepo: Repository<Seflik>,
  ) {}

  async find(): Promise<Seflik[]> {
    return this.seflikRepo.find();
  }

  async findByName(seflik_name: string): Promise<Seflik | null> {
    return this.seflikRepo.findOne({ where: { seflik_name } });
  }
  async findById(id: number): Promise<Seflik> {
    return this.seflikRepo.findOneByOrFail({ id });
  }
}
