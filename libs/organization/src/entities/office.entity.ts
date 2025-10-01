import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  office_name: string;
}
