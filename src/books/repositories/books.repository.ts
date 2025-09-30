import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "../entities/books.entity";
import { Repository } from "typeorm";
import { UpdateBookDto } from "../dtos/update-book.dto";

@Injectable()
export class BookRepository {
    constructor(@InjectRepository(Book) private readonly repo: Repository<Book>) { }

    async find(): Promise<Book[]> {
        return this.repo.find();
    }
    
    async save(book: Partial<Book>): Promise<Book> {
        const newBook = this.repo.create(book);
        return this.repo.save(newBook);
    }

    async findOneById(id: number): Promise<Book> {
        const book = await this.repo.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with ID '${id}' was not found!`);
        }
        return book;
    }

    async update(id: number, updateBook: UpdateBookDto) {
        //look for the book
        const book = await this.findOneById(id);
 
        //update
        Object.assign(book, updateBook);
        return await this.repo.save(book);
    }

    async remove(id: number) {
        //look for the book
        const book = await this.findOneById(id);
        if (!book) {
            throw new NotFoundException(`Book with ID '${id}' was not found!`);
        }
        //delete
        return  await this.repo.remove(book);
    }

}