import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../services/book.service'; 
import { BookRepository } from '../repositories/books.repository';

//unit tests
describe('BookService', () => {
  let service: BookService;

  const mockBookRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: mockBookRepository }
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });


  //test1
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test2
  describe('create', () => {
    it('can create a new book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedYear: 2025 };
      mockBookRepository.save.mockResolvedValue(mockBook);
      
      const result = await service.create({ title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 });

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.save).toHaveBeenCalledWith({ title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 });
    });
  });

  //test3
  describe('findAll', () => {
    it('can return a list of books', async () => {
      const mockBooks = [
        { id: 1, title: 'Book One', author: 'A', publishedyear: 2023 },
        { id: 2, title: 'Book Two', author: 'B', publishedyear: 2024 }
      ];
      
      mockBookRepository.find.mockResolvedValue(mockBooks);
      
      const result = await service.findAll();
    
      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.find).toHaveBeenCalled();
    });
  });

  //test4
  describe('update', () => {
    //test4.1
    it('can update a book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 };
      mockBookRepository.update.mockResolvedValue(mockBook);

      const result = await service.update(1, { title: 'Updated Test Book' });

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.update).toHaveBeenCalledWith(1, { title: 'Updated Test Book' });
    });

    //test4.2
    it('can throw error if book does not exist', async () => {
      //make it throw an error during the update
      mockBookRepository.update.mockRejectedValue(new Error('Book with ID 2 was not found!'));

      await expect(
        service.update(2, { title: 'Updated Test Book' })
      ).rejects.toThrow('Book with ID 2 was not found!');
    });
  });


  //test5
  describe('remove', () => {

    //test5.1
    it('can remove a book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 };
      mockBookRepository.remove.mockResolvedValue(mockBook);

      const result = await service.remove(1);

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.remove).toHaveBeenCalledWith(1);
    });

    //test5.2
    it('can throw error if book does not exist', async () => {
      //make it throw an error during the remove
      mockBookRepository.remove.mockRejectedValue(new Error('Book with ID 2 was not found!'));

      await expect(
        service.remove(2)
      ).rejects.toThrow('Book with ID 2 was not found!');
    });
  });
});