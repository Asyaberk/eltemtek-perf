import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from '../services/library.service';
import { LibraryRepository } from '../repositories/library.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRentalDto } from '../dtos/create-rental.dto';

const mockLibraryRepository = {
  rentBook: jest.fn(),
  returnBook: jest.fn(),
  findAvailableBooks: jest.fn(),
  findAll: jest.fn(),
  findUserRentals: jest.fn(),
};

describe('LibraryService', () => {
  let service: LibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        { provide: LibraryRepository, useValue: mockLibraryRepository },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('rent', () => {
    it('should rent a book when available', async () => {
      const userId = 7;
      const dto: CreateRentalDto = { bookId: 2 };

      const rental = {
        id: 100,
        user: { id: userId },
        book: { id: dto.bookId, available: false },
      };
      mockLibraryRepository.rentBook.mockResolvedValue(rental);

      const result = await service.rent(userId, dto);

      expect(result).toEqual(rental);
      expect(mockLibraryRepository.rentBook).toHaveBeenCalledWith(userId, dto.bookId);
    });

    it('should throw BadRequestException if book already rented', async () => {
      const userId = 1;
      const dto: CreateRentalDto = { bookId: 99 };

      mockLibraryRepository.rentBook.mockRejectedValue(
        new BadRequestException('This book is already rented!'),
      );

      await expect(service.rent(userId, dto)).rejects.toThrow(BadRequestException);
      expect(mockLibraryRepository.rentBook).toHaveBeenCalledWith(userId, dto.bookId);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      const userId = 1;
      const dto: CreateRentalDto = { bookId: 12345 };

      mockLibraryRepository.rentBook.mockRejectedValue(
        new NotFoundException(`Book ${dto.bookId} not found!`),
      );

      await expect(service.rent(userId, dto)).rejects.toThrow(NotFoundException);
      expect(mockLibraryRepository.rentBook).toHaveBeenCalledWith(userId, dto.bookId);
    });
  });

  describe('returnBook', () => {
    it('should return a book and confirm message', async () => {
      const userId = 2;
      const bookId = 10;
      const message = { message: `Book with ID ${bookId} has been returned!` };

      mockLibraryRepository.returnBook.mockResolvedValue(message);

      const result = await service.returnBook(userId, bookId);

      expect(result).toEqual(message);
      expect(mockLibraryRepository.returnBook).toHaveBeenCalledWith(userId, bookId);
    });

    it('should throw NotFoundException if no rental found', async () => {
      const userId = 3;
      const bookId = 11;

      mockLibraryRepository.returnBook.mockRejectedValue(
        new NotFoundException('No rental found for this book and user!'),
      );

      await expect(service.returnBook(userId, bookId)).rejects.toThrow(NotFoundException);
      expect(mockLibraryRepository.returnBook).toHaveBeenCalledWith(userId, bookId);
    });
  });

  describe('listAll', () => {
    it('should list all rentals', async () => {
      const rentals = [
        { id: 1, user: { id: 1 }, book: { id: 1 } },
        { id: 2, user: { id: 2 }, book: { id: 2 } },
      ];
      mockLibraryRepository.findAll.mockResolvedValue(rentals);

      const result = await service.listAll();

      expect(result).toEqual(rentals);
      expect(mockLibraryRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('listAvailableBooks', () => {
    it('should list available books', async () => {
      const books = [
        { id: 1, title: 'A', available: true },
        { id: 2, title: 'B', available: true },
      ];
      mockLibraryRepository.findAvailableBooks.mockResolvedValue(books);

      const result = await service.listAvailableBooks();

      expect(result).toEqual(books);
      expect(mockLibraryRepository.findAvailableBooks).toHaveBeenCalled();
    });
  });

  describe('listUserRentals', () => {
    it('should list rentals of a specific user', async () => {
      const userId = 42;
      const rentals = [
        { id: 10, book: { id: 5 } },
        { id: 11, book: { id: 6 } },
      ];
      mockLibraryRepository.findUserRentals.mockResolvedValue(rentals);

      const result = await service.listUserRentals(userId);

      expect(result).toEqual(rentals);
      expect(mockLibraryRepository.findUserRentals).toHaveBeenCalledWith(userId);
    });
  });
});
