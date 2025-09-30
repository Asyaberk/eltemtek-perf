import { InjectRepository } from "@nestjs/typeorm";
import { Rental } from "../entities/rental.entity";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Book } from "../../books/entities/books.entity";
import { User } from "../../users/entities/users.entity";

@Injectable()
export class LibraryRepository {
  constructor(
    @InjectRepository(Rental) private readonly rentRepo: Repository<Rental>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) { }
  
  //rent book!!!!
  async rentBook(userId: number, bookId: number): Promise<Rental> {
    //get the book with id
    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException(`Book ${bookId} not found!`);

    //check books avaialability
    if (!book.available) {
      throw new BadRequestException('This book is already rented!');
    }

    //mark false when rented and update book status
    book.available = false;
    await this.bookRepo.save(book);

    //create rental
    const rental = this.rentRepo.create({
      user: { id: userId } as User,
      book: { id: bookId } as Book,
    });

    return await this.rentRepo.save(rental);
  }

  //return book!!!
  async returnBook(userId: number, bookId: number): Promise<{ message: string }> {
    //find rental with book id and user id
    //user will be delete rental by books id
    const rental = await this.rentRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
      relations: ['book'],
    });
    if (!rental) throw new NotFoundException(`No rental found for this book and user!`);

    //make avalible true again
    rental.book.available = true;
    await this.bookRepo.save(rental.book);

    //delete rental with that id
    await this.rentRepo.remove(rental);

    return { message: `Book with ID ${bookId} has been returned!` };
  }


  //list all (for admin)
  async findAll(): Promise<Rental[]> {
    return this.rentRepo.find({ relations: ['user', 'book'] },);
  }

  //list all availiable(for user)
  async findAvailableBooks(): Promise<Book[]> {
    return this.bookRepo.find({ where: { available: true } });
  }

  //see owned rental books (for user)
  async findUserRentals(userId: number): Promise<Rental[]> {
    return this.rentRepo.find({
      where: { user: { id: userId } },
      relations: ['book'],
    });
  }

}
