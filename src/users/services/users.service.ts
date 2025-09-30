import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {

    //own repository
    constructor(private readonly userRepository: UserRepository) { }
    
    //to list all roles from the database
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
 