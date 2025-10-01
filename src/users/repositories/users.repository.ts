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
      select: ['id', 'sicil_no', 'first_name', 'last_name', 'email'],
      relations: [
        'role',
        'department',
        'office',
        'tesis',
        'seflik',
        'mudurluk',
      ],
      order: { last_name: 'ASC', first_name: 'ASC' },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: [
        'role',
        'department',
        'office',
        'tesis',
        'seflik',
        'mudurluk',
      ],
    });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'role',
        'department',
        'office',
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
