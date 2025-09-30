import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../controllers/book.controller';
import { BookService } from '../services/book.service';

// unit test :
// ..service.spec.ts testlwri business logic + repository interactiona bakıyor
// ..controller.spec.ts testleri HTTP layer (controller) to service çağrısı akışına bakıyor

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBookService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: BookService, useValue: mockBookService }
      ]
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  //test1
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // //test2
  // describe('getAllBooks', () => {
  //   it('can get books list', async () => {
  //     const mockBooks = [
  //       { id: 1, title: 'Book One', author: 'A', publishedyear: 2025 },
  //       { id: 2, title: 'Book Two', author: 'B', publishedyear: 2024 }
  //     ];

  //     mockBookService.findAll.mockResolvedValue(mockBooks);

  //     const result = await controller.getAllBooks();

  //     expect(result).toEqual(mockBooks);
  //     expect(mockBookService.findAll).toHaveBeenCalled();
  //   });
  // });


  //test3
  describe('createBook', () => {
    //test3.1
    it('can create a new book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedYear: 2025 };
      mockBookService.create.mockResolvedValue(mockBook);
      
      const result = await controller.createBook({ title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 });

      expect(result).toEqual(mockBook);
      expect(mockBookService.create).toHaveBeenCalledWith({ title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 });
    });
  });

  //test4
  describe('updateBook', () => {

    //test4.1
    it('can update a book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 };
      mockBookService.update.mockResolvedValue(mockBook);

      const result = await controller.updateBook('1', { title: 'Updated Test Book' });

      expect(result).toEqual(mockBook);
      expect(mockBookService.update).toHaveBeenCalledWith(1, { title: 'Updated Test Book' });
    });

    //test4.2
    it('can throw error if book does not exist', async () => {
      //make it throw an error during the update
      mockBookService.update.mockRejectedValue(new Error('Book with ID 2 was not found!'));

      await expect(
        controller.updateBook('2', { title: 'Updated Test Book' })
      ).rejects.toThrow('Book with ID 2 was not found!');
    });
  });

  //test5
  describe('deleteBook', () => {

    //test5.1
    it('can remove a book', async () => {
      const mockBook = { id: 1, title: 'Test Book', author: 'Asya Berk', publishedyear: 2025 };
      mockBookService.remove.mockResolvedValue(mockBook);

      const result = await controller.deleteBook('1');

      expect(result).toEqual(mockBook);
      expect(mockBookService.remove).toHaveBeenCalledWith(1);
    });

    //test5.2
    it('can throw error if book does not exist', async () => {
      //make it throw an error during the remove
      mockBookService.remove.mockRejectedValue(new Error('Book with ID 2 was not found!'));

      await expect(
        controller.deleteBook('2')
      ).rejects.toThrow('Book with ID 2 was not found!');
    });
  });
});