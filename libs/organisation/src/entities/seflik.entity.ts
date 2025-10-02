import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('seflikler')
export class Seflik {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  seflik_name: string;
}
