// src/users/entities/users.entity.ts
import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm"; 
import { Department, Tesis, Seflik, Mudurluk, Role } from  "libs/organisation/src";
import { Exclude } from "class-transformer";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //personel nosu
  @Index({ unique: true })
  @Column()
  sicil_no: string;

  //adı Soyadı
  @Column()
  first_last_name: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  //bölümü
  @ManyToOne(() => Department, { nullable: true, eager: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  //görevi
  @ManyToOne(() => Role, (role) => role.users, { nullable: true, eager: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  //tesis
  @ManyToOne(() => Tesis, { nullable: true, eager: true })
  @JoinColumn({ name: 'tesis_id' })
  tesis?: Tesis;

  //şeflik
  @ManyToOne(() => Seflik, { nullable: true, eager: true })
  @JoinColumn({ name: 'seflik_id' })
  seflik?: Seflik;

  //müdürlük
  @ManyToOne(() => Mudurluk, { nullable: true, eager: true })
  @JoinColumn({ name: 'mudurluk_id' })
  mudurluk?: Mudurluk;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id: ', this.id);
  }
}
