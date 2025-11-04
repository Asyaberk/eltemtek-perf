import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from '../dtos/question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private readonly repo: Repository<Question>,
  ) {}

  findAll() {
    return this.repo.find({ order: { orderNo: 'ASC' } });
  }

  async findOne(id: number) {
    const question = await this.repo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`); 
    }
    return question;
  }

  async create(createQuestionDto: CreateQuestionDto) {
    const newQuestion = this.repo.create(createQuestionDto);
    return this.repo.save(newQuestion);
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    // Önce kaydın varlığını kontrol edin
    const question = await this.findOne(id);

    // Kaydı DTO verileriyle birleştirin
    Object.assign(question, updateQuestionDto);

    return this.repo.save(question);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return {
      message: `Question with ID ${id} successfully deleted`,
    };
  }
}
