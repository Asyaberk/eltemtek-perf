import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mudurluk } from '../entities/mudurluk.entity';

@Injectable()
export class MudurlukRepository {
  constructor(
    @InjectRepository(Mudurluk)
    private readonly mudurlukRepo: Repository<Mudurluk>,
  ) {}

  async find(): Promise<Mudurluk[]> {
    return this.mudurlukRepo.find();
  }
    
  async findByName(mudurluk_name: string): Promise<Mudurluk | null> {
    return this.mudurlukRepo.findOne({ where: { mudurluk_name } });
  }

  async findById(id: number): Promise<Mudurluk> {
    return this.mudurlukRepo.findOneByOrFail({ id });
  }
}
