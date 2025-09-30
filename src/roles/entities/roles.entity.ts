import { User } from "../../users/entities/users.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterInsert } from "typeorm"; 

@Entity('role')
export class Role{

    @PrimaryGeneratedColumn()
    id: number;

    //role names like user, admin etc
    @Column()
    name: string;

    //There can be more than one user with a role (but a user can have at most one role.) 
    @OneToMany(() => User, user => user.role)
    users: User[];

    //control role insert from terminal (@AfterRemove/Update could be added later)
    @AfterInsert()
    logInsert() {
        console.log('Inserted Role with id: ', this.id);
    }
}