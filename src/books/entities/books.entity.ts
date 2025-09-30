import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm"; 

@Entity('book')
export class Book{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedyear: number;

    //for rental 
    @Column({ default: true })
    available: boolean;

    //control role insert from terminal 
    @AfterInsert()
    logInsert() {
        console.log('Inserted Book with id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated Book with id: ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed Book with id: ', this.id);
    }
}