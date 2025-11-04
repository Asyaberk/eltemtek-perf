//weights tablosunda role göre soru puanı tutulacak çünkü her rol için en son ç<rpılan katsayı puanı farklı
//20 soru var, sorular aynı.                değişken olanlar:
                                            // kişinin soruya verdiği cevap
                                            // kişinin sorudan aldığu 1-4 arası puan
                                            // kişinin rolüne göre çarpılan 0-2 arası katsayı puanı


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Role } from 'libs/organisation/src/entities/roles.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('weights')
@Unique(['role', 'question'])
export class Weight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Question, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  //0 ve 2 arası, sorulardan alınan 1-4 arası puanla çarpılan katsayı değeri
  @Column({ type: 'float', default: 0 })
  weight: number;
}
