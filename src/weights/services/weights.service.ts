import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weight } from '../entities/weights.entity';

@Injectable()
export class WeightsService {
  constructor(
    @InjectRepository(Weight)
    private readonly repo: Repository<Weight>,
  ) {}

  //Tüm weight kayıtlarını getir
  findAll() {
    return this.repo.find({
      relations: ['role', 'question'],
      order: { id: 'ASC' },
    });
  }

  //Tek bir weight kaydını getir
  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['role', 'question'],
    });
    if (!item) throw new NotFoundException('Weight not found');
    return item;
  }

  //Weight güncelle
  async update(id: number, weight: number) {
    const item = await this.findOne(id);
    item.weight = weight;
    return this.repo.save(item);
  }

}
