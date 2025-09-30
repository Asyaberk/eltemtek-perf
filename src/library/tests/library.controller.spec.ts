import { Test, TestingModule } from '@nestjs/testing';
import { LibraryController } from '../controllers/library.controller';
import { LibraryService } from '../services/library.service';
import { CreateRentalDto } from '../dtos/create-rental.dto';

describe('LibraryController', () => {
  let controller: LibraryController;
  let mockLibraryService: {
    listAvailableBooks: jest.Mock;
    listUserRentals: jest.Mock;
    rent: jest.Mock;
    returnBook: jest.Mock;
    listAll: jest.Mock;
  };

  beforeEach(async () => {
    mockLibraryService = {
      listAvailableBooks: jest.fn(),
      listUserRentals: jest.fn(),
      rent: jest.fn(),
      returnBook: jest.fn(),
      listAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [{ provide: LibraryService, useValue: mockLibraryService }],
    }).compile();

    controller = module.get<LibraryController>(LibraryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailableBooks', () => {
    it('returns available books', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'Book One',
          author: 'A',
          publishedYear: 2025,
          available: true,
        },
        {
          id: 2,
          title: 'Book Two',
          author: 'B',
          publishedYear: 2024,
          available: true,
        },
      ];

      mockLibraryService.listAvailableBooks.mockResolvedValue(mockBooks);

      const result = await controller.getAvailableBooks();

      expect(result).toEqual(mockBooks);
      expect(mockLibraryService.listAvailableBooks).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMyBooks', () => {
    it('returns rentals for the current user', async () => {
      const req = { user: { id: 99 } } as any;
      const rentals = [
        { id: 10, book: { id: 1, title: 'Clean Code' } },
        { id: 11, book: { id: 2, title: 'Atomic Habits' } },
      ];
      mockLibraryService.listUserRentals.mockResolvedValue(rentals);

      const result = await controller.getMyBooks(req);

      expect(result).toEqual(rentals);
      expect(mockLibraryService.listUserRentals).toHaveBeenCalledWith(99);
      expect(mockLibraryService.listUserRentals).toHaveBeenCalledTimes(1);
    });
  });

  describe('rentBook', () => {
    it('rents a book for the current user', async () => {
      const req = { user: { id: 7 } } as any;
      const dto: CreateRentalDto = { bookId: 5 };
      const rental = {
        id: 123,
        user: { id: 7 },
        book: { id: 5, title: 'Clean Code', available: false },
      };
      mockLibraryService.rent.mockResolvedValue(rental);

      const result = await controller.rentBook(req, dto);

      expect(result).toEqual(rental);
      expect(mockLibraryService.rent).toHaveBeenCalledWith(7, dto);
      expect(mockLibraryService.rent).toHaveBeenCalledTimes(1);
    });
  });

  describe('returnBook', () => {
    it('returns a book by id for the current user', async () => {
      const req = { user: { id: 3 } } as any;
      const message = { message: 'Book with ID 10 has been returned!' };
      mockLibraryService.returnBook.mockResolvedValue(message);

      const result = await controller.returnBook(req, '10');

      expect(result).toEqual(message);
      expect(mockLibraryService.returnBook).toHaveBeenCalledWith(3, 10);
      expect(mockLibraryService.returnBook).toHaveBeenCalledTimes(1);
    });
  });

  describe('listAllRentals', () => {
    it('lists all rentals (admin use-case)', async () => {
      const allRentals = [
        {
          id: 1,
          user: { id: 1, email: 'u1@mail.com' },
          book: { id: 2, title: 'Clean Code' },
        },
        {
          id: 2,
          user: { id: 2, email: 'u2@mail.com' },
          book: { id: 3, title: 'Atomic Habits' },
        },
      ];
      mockLibraryService.listAll.mockResolvedValue(allRentals);

      const result = await controller.listAllRentals();

      expect(result).toEqual(allRentals);
      expect(mockLibraryService.listAll).toHaveBeenCalledTimes(1);
    });
  });
});
