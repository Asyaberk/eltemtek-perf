import { Injectable } from '@nestjs/common';
import { BookRepository } from '../repositories/books.repository';
import { Book } from '../entities/books.entity';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) { }

    //to list all books from the database(admin,user)
    async findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }
    
    //(admin)
    create(body: CreateBookDto) {
        return this.bookRepository.save(body);
    }

    update(id: number, body: UpdateBookDto): Promise<Book> {
        //return id and updated value
        return this.bookRepository.update(id, body); 
    }

    remove(id: number): Promise<Book> {
        return this.bookRepository.remove(id);
    } 

}
