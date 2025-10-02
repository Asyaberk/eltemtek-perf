import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('tesis')
export class Tesis {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  tesis_name: string;
}
