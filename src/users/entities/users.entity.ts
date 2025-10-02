// src/users/entities/users.entity.ts
import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm"; 
import { Role } from "../../roles/entities/roles.entity";
import { Exclude } from "class-transformer";
import { Department, Office, Tesis, Seflik, Mudurluk } from "@app/organisation";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //personel nosu
  @Index({ unique: true })
  @Column()
  sicil_no: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  //yetkilendirme için olabilir gibi
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'manager_id' })
  manager?: User;

  //FKler, ayrı ayrı
  @ManyToOne(() => Department, { nullable: false, eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Office, { nullable: true, eager: true })
  @JoinColumn({ name: 'office_id' })
  office?: Office;

  @ManyToOne(() => Tesis, { nullable: true, eager: true })
  @JoinColumn({ name: 'tesis_id' })
  tesis?: Tesis;

  @ManyToOne(() => Seflik, { nullable: true, eager: true })
  @JoinColumn({ name: 'seflik_id' })
  seflik?: Seflik;

  @ManyToOne(() => Mudurluk, { nullable: true, eager: true })
  @JoinColumn({ name: 'mudurluk_id' })
  mudurluk?: Mudurluk;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id: ', this.id);
  }
}
