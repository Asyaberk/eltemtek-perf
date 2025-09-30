import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"; 
import { Role } from "../../roles/entities/roles.entity";
import { Exclude } from "class-transformer";


@Entity('user')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    //exclude, we dont want to see pasword in body response
    @Exclude()
    @Column()
    password: string;

    //A user can have at most one role (but there can be more than one user with a role)
    @ManyToOne(() => Role, role => role.users)
    role: Role;

    //control user insert from terminal  
    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id: ', this.id);
    }

}