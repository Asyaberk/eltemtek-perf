import { Injectable } from '@nestjs/common';
import { LibraryRepository } from '../repositories/library.repository';
import { CreateRentalDto } from '../dtos/create-rental.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly repo: LibraryRepository,
  ) { }

  async rent(userId: number, dto: CreateRentalDto) {
    return this.repo.rentBook(userId, dto.bookId);
  }

  async returnBook(userId: number, bookId: number) {
    return this.repo.returnBook(userId, bookId);
  }
  
  async listAll() {
    return this.repo.findAll();
  }

  async listAvailableBooks() {
    return this.repo.findAvailableBooks();
  }

  async listUserRentals(userId: number) {
    return this.repo.findUserRentals(userId);
  }
}