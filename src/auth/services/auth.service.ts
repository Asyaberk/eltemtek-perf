import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
//installled bcrypt
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { UserRepository } from '../../users/repositories/users.repository';
import { User } from '../../users/entities/users.entity';
import { RolesRepository, DepartmentRepository, TesisRepository, SeflikRepository, MudurlukRepository } from 'libs/organisation/src';

@Injectable()
export class AuthService {
  //jwt web token
  //own user repo
  constructor(
    private readonly repo: UserRepository,
    private readonly roleRepo: RolesRepository,
    private readonly departmentRepo: DepartmentRepository,
    private readonly tesisRepo: TesisRepository,
    private readonly seflikRepo: SeflikRepository,
    private readonly mudurlukRepo: MudurlukRepository,
    private readonly jwtService: JwtService,
  ) {}

  //register function
  async register(body: CreateUserDto) {
    const sicilExists = await this.repo.findOneBySicilNo(body.sicil_no);
    if (sicilExists) {
      throw new BadRequestException('This sicil_no is already registered!');
    }

    const hashedPassword = body.password
      ? await bcrypt.hash(body.password, 10)
      : undefined;

    const role = body.role_id
      ? await this.roleRepo.findById(body.role_id)
      : undefined;
    const department = body.department_id
      ? await this.departmentRepo.findById(body.department_id)
      : undefined;
    const tesis = body.tesis_id
      ? await this.tesisRepo.findById(body.tesis_id)
      : undefined;
    const seflik = body.seflik_id
      ? await this.seflikRepo.findById(body.seflik_id)
      : undefined;
    const mudurluk = body.mudurluk_id
      ? await this.mudurlukRepo.findById(body.mudurluk_id)
      : undefined;

    const user = await this.repo.save({
      sicil_no: body.sicil_no,
      first_last_name: body.first_last_name,
      password: hashedPassword,
      role,
      department,
      tesis,
      seflik,
      mudurluk,
    });

    const userToken = await this.createToken(user);
    return {
      userToken,
      user: {
        id: user.id,
        sicil_no: user.sicil_no,
        role: user.role?.name,
      },
    };
  }

  //Token creation
  //We receive the token from the user for each request, validate it, and use it for permission.
  async createToken(user: User): Promise<string> {
    return this.jwtService.sign({
      sub: user.id,
      sicil_no: user.sicil_no,
      role: user.role?.name,
    });
  }

  //login fuction
  async login(body: LoginUserDto, response) {
    const user = await this.repo.findOneBySicilNo(body.sicil_no);
    if (!user) {
      throw new UnauthorizedException('No account found with this sicil_no!');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account has no password yet. Please set a password first.',
      );
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect!');
    }

    const jwt = await this.createToken(user);

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'SUCCESS: Logged in!',
      user: { id: user.id, sicil_no: user.sicil_no, role: user.role?.name },
    };
  }
  async changePassword(sicil_no: string, newPassword: string) {
    const user = await this.repo.findOneBySicilNo(sicil_no);
    if (!user) {
      throw new NotFoundException('No account found with this sicil_no!');
    }

    if (user.password) {
      throw new BadRequestException(
        'Password already set. Please use update password feature.',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.repo.save(user);

    return { message: 'Password successfully set.' };
  }

  //logout function
  logout(response) {
    response.clearCookie('jwt');
    return { message: 'SUCCESS: Logged out!' };
  }

  //update function
  async updateUser(id: string, body: Partial<CreateUserDto>) {
    const user = await this.repo.findOneBySicilNo(id);
    if (!user) throw new NotFoundException('User not found.');

    //parola güncellenecekse hashlemek gerek
    if (body.password) {
      user.password = await bcrypt.hash(body.password, 10);
    }

    if (body.role_id) user.role = await this.roleRepo.findById(body.role_id);
    if (body.department_id)
      user.department = await this.departmentRepo.findById(body.department_id);
    if (body.tesis_id)
      user.tesis = await this.tesisRepo.findById(body.tesis_id);
    if (body.seflik_id)
      user.seflik = await this.seflikRepo.findById(body.seflik_id);
    if (body.mudurluk_id)
      user.mudurluk = await this.mudurlukRepo.findById(body.mudurluk_id);
    if (body.first_last_name) user.first_last_name = body.first_last_name;
    if (body.sicil_no) user.sicil_no = body.sicil_no;

    await this.repo.save(user);

    return {
      message: 'User updated successfully.',
      user,
    };
  }

  //delete function
  async deleteUser(id: string) {
    const user = await this.repo.findOneBySicilNo(id);
    if (!user) throw new NotFoundException('User not found.');

    await this.repo.deleteById(id);
    return { message: `User with ID ${id} deleted successfully.` };
  }
}
