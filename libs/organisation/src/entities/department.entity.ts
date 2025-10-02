import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  department_name: string;
}
