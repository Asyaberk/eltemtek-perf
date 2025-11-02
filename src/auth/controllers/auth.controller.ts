import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/entities/users.entity';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';

//We add these because the password field is automatically removed from the response.
@UseInterceptors(ClassSerializerInterceptor)
//user auth
@Controller('auth')
//api tags for swagger
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //kullanıcı ekleme(ik)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('İnsan Kaynakları')
  //register function
  @Post('/register')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register a new user (HR only)',
    description:
      'Registers a new employee with sicil_no, password, and optional department/role fields. Only HR users can perform this action.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    schema: {
      example: {
        message: 'User registered successfully.',
        user: {
          id: 1,
          sicil_no: '00518',
          first_last_name: 'Asya Berk',
          hireDate: '2024-08-15',
          department: { id: 3, department_name: 'İletişim' },
          role: { id: 2, name: 'Teknik Şef' },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Registration failed: Sicil no already registered or invalid data.',
    schema: {
      example: {
        statusCode: 400,
        message: 'This sicil_no is already registered!',
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  //kullanıcı update etme(ik)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('İnsan Kaynakları')
  @Put('/update/:sicilNo')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update user information (HR only)',
    description:
      'Allows HR to update user data (e.g. name, department, role, password, hire date, evaluatedBySicilNo).',
  })
  @ApiParam({
    name: 'sicilNo',
    description: 'Sicil number (employee ID) of the user to update.',
    example: '00518',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    schema: {
      example: {
        message: 'User updated successfully.',
        user: {
          id: 1,
          sicil_no: '00518',
          first_last_name: 'Asya Berk',
          hireDate: '2024-08-15',
          department: { id: 3, department_name: 'İletişim' },
          role: { id: 2, name: 'Teknik Şef' },
        },
      },
    },
  })
  @ApiBody({
    description: 'Fields that can be updated by HR.',
    schema: {
      example: {
        first_last_name: 'Asya Berk Güncellenmiş',
        hireDate: '2024-09-01',
        evaluatedBySicilNo: '00007',
        department_id: 3,
        role_id: 2,
        tesis_id: 1,
      },
    },
  })
  async updateUser(
    @Param('sicilNo') sicilNo: string,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return this.authService.updateUser(sicilNo, body);
  }

  //kullanıcı silme(ik)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('İnsan Kaynakları')
  @Delete('/delete/:sicilNo')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete user (HR only)',
    description:
      'Deletes a user by their Sicil No. Only HR can perform this action.',
  })
  @ApiParam({
    name: 'sicilNo',
    description: 'Sicil number (employee ID) of the user to delete.',
    example: '00518',
  })
  @ApiOkResponse({
    description: 'User deleted successfully.',
    schema: {
      example: { message: 'User with Sicil No 00518 deleted successfully.' },
    },
  })
  async deleteUser(@Param('sicilNo') sicilNo: string) {
    return this.authService.deleteUser(sicilNo);
  }

  //login function
  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login with Sicil No and password',
    description:
      'Authenticates a user using Sicil No and password, then returns a JWT token (stored in HTTP-only cookie).',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'User logged in successfully.',
    schema: {
      example: {
        message: 'SUCCESS: Logged in!',
        user: {
          id: 1,
          sicil_no: '00518',
          first_last_name: 'Asya Berk',
          role: { id: 2, name: 'Teknik Şef' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Password is incorrect!',
        error: 'Unauthorized',
      },
    },
  })
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body, response);
  }

  //logout function
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Logout the currently authenticated user',
    description: 'Clears the JWT cookie and logs the user out.',
  })
  @ApiOkResponse({
    description: 'User logged out successfully.',
    schema: {
      example: { message: 'SUCCESS: Logged out!' },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'No active session or invalid token.',
  })
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  //change password(for both new and old users that has no password or wnats a change)
  @Put('/change-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Set or update password for a user' })
  @ApiBody({
    description:
      'Provide the sicil_no of the user and the new password to set or update.',
    schema: {
      example: {
        sicil_no: 'IK100',
        newPassword: 'StrongPassword123!',
      },
    },
  })
  @ApiOkResponse({
    description: 'Password successfully set or updated.',
    schema: {
      example: { message: 'Password successfully set.' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Password already set or invalid data provided.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Password already set. Please use update password feature.',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or user not found.',
    schema: {
      example: {
        statusCode: 401,
        message: 'No account found with this sicil_no!',
        error: 'Unauthorized',
      },
    },
  })
  async changePassword(
    @Body() body: { sicil_no: string; newPassword: string },
  ) {
    return this.authService.changePassword(body.sicil_no, body.newPassword);
  }

  //check current user to test login logout function
  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOperation({
    summary: 'Get current authenticated user',
    description: 'Returns info about the currently logged-in user.',
  })
  @ApiOkResponse({
    description: 'Returns the details of the currently logged-in user.',
    schema: {
      example: {
        id: 1,
        sicil_no: '00518',
        first_last_name: 'Asya Berk',
        role: { name: 'İnsan Kaynakları' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Token is missing or invalid.',
  })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}

