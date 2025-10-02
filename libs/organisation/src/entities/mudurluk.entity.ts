import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('mudurlukler')
export class Mudurluk {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  mudurluk_name: string;
}
