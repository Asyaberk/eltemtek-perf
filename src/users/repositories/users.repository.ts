import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
// Custom user repository
export class UserRepository {
  // Injecting repository to avoid raw sql and ensure safety
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'email'],
      relations: ['role'],
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    return user || null;
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return user;
  }

  async save(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }
}
