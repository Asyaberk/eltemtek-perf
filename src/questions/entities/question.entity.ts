import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('questions')
@Unique(['orderNo'])
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    //20 questions
    @Column({ type: 'int' })
    orderNo: number;

    //soru türü ismi
    @Column({ type: 'varchar', length: 128 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;
}
