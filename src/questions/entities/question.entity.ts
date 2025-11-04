import { Weight } from 'src/weights/entities/weights.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';

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

    //for weight seed
    @OneToMany(() => Weight, (weight) => weight.question)
    weights: Weight[];
}
