// src/users/repositories/users.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'sicil_no', 'first_last_name'],
      relations: [
        'role',
        'department',
        'tesis',
        'seflik',
        'mudurluk',
      ],
      order: { first_last_name: 'ASC' },
    });
  }

  //sicil idye göre YAPIALACAK
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'role',
        'department',
        'tesis',
        'seflik',
        'mudurluk',
      ],
    });
    if (!user) throw new NotFoundException(`User with ID '${id}' not found.`);
    return user;
  }

  async save(user: Partial<User>): Promise<User> {
    const entity = this.userRepo.create(user);
    return this.userRepo.save(entity);
  }
}
