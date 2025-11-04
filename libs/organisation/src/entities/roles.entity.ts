import { User } from "src/users/entities/users.entity";
import { Weight } from "src/weights/entities/weights.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterInsert, Unique } from "typeorm"; 

@Entity('roles')
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  //role names like İdari Personel, Teknik Personel, Uzman...
  @Column()
  name: string;

  //There can be more than one user with a role (but a user can have at most one role.)
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  //for weight seed
  @OneToMany(() => Weight, (weight) => weight.role)
  weights: Weight[];

  //control role insert from terminal (@AfterRemove/Update could be added later)
  @AfterInsert()
  logInsert() {
    console.log('Inserted Role with id: ', this.id);
  }
}


