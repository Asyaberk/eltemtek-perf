import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
//installled bcrypt
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { UserRepository } from '../../users/repositories/users.repository';

@Injectable()
export class AuthService {
    //jwt web token
    //own user repo
    constructor(
        private readonly repo: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    //register function
    async register(body: RegisterUserDto) {
        //check if email is in use and have user
        const user = await this.repo.findOneByEmail(body.email);
        if (!user) {
          throw new BadRequestException('No HR record found for this email.');
        }
        if (user.password) {
          throw new BadRequestException('Account already activated.');
        }
        //hash
        user.password = await bcrypt.hash(body.password, 10);
        //create and save user
        const savedUser = await this.repo.save(user); 
        const userToken = await this.createToken(savedUser) 
        return {
            userToken,
            user: { id: savedUser.id, email: savedUser.email}
        };
    } 

    //Token creation
    //We receive the token from the user for each request, validate it, and use it for permission.
    async createToken(user): Promise<string> {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
    }


    //login fuction
    async login(body: LoginUserDto, response) {

        //find if user exists by email
        const user = await this.repo.findOneByEmail(body.email);
        if (!user) {
            throw new UnauthorizedException('No account found with this email!');
        }

        if (!user.password) {
            throw new UnauthorizedException(
                'Password is not set for this account.',
            );
        }
        
        //compare entered passwords with existing password
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Password is incorrect!');
        }

        //generate JWT tokens
        const jwt = await this.createToken(user);

        //store in cookie
        response.cookie('jwt', jwt, { httpOnly: true });

        return {
            message: 'SUCCESS: Logged in!',
            user: { id: user.id, email: user.email, role: user.role.name }
        };
    }

    //logout function
    logout(response) {
        response.clearCookie('jwt');
        return { message: 'SUCCESS: Logged out!' };
    }
}
