import { Book } from "../../books/entities/books.entity";
import { User } from "../../users/entities/users.entity";
import { AfterInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('rental')
export class Rental {

    @PrimaryGeneratedColumn()
    id: number;

    //foreign keys(book and users id)
    @ManyToOne(() => Book, { eager: false })
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    rentdate: Date;

    @AfterInsert()
    logInsert() {
        console.log('Inserted Rental with id:', this.id);
    }
}
