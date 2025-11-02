import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/entities/users.entity';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
    summary: 'Register a new user with sicil_no and password (HR only)',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    schema: {
      example: {
        userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: { id: 1, sicil_no: '518' },
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
  @Put('/update/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user information (HR only)' })
  @ApiOkResponse({
    description: 'User updated successfully.',
    schema: {
      example: {
        message: 'User updated successfully.',
        user: {
          id: 1,
          sicil_no: 'IK100',
          first_last_name: 'İhsan Kaya',
          department: { id: 21, name: 'İnsan Kaynakları' },
          role: { id: 19, name: 'İdari Personel' },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data.',
  })
  @ApiBody({
    description: 'Fields that can be updated by HR.',
    schema: {
      example: {
        sicil_no: 'IK101',
        first_last_name: 'İhsan KAYA',
        password: 'newSecurePass123',
        department_id: 22,
        role_id: 18,
        tesis_id: 2,
        seflik_id: 11,
        mudurluk_id: 3,
      },
    },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return this.authService.updateUser(id, body);
  }

  //kullanıcı silme(ik)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('İnsan Kaynakları')
  @Delete('/delete/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user by ID (HR only)' })
  @ApiOkResponse({
    description: 'User deleted successfully.',
    schema: {
      example: { message: 'User with ID 12 deleted successfully.' },
    },
  })
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  //login function
  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with sicil_no and password' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'User logged in successfully.',
    schema: {
      example: {
        message: 'SUCCESS: Logged in!',
        user: { id: 1, sicil_no: '518', role: 'İdari Personel' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Login failed: Invalid sicil_no or password.',
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
  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({
    description: 'User logged out successfully.',
    schema: {
      example: { message: 'SUCCESS: Logged out!' },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: No active session.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized: No active session.',
        error: 'Unauthorized',
      },
    },
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
  @ApiOkResponse({
    description: 'Returns the details of the currently logged-in user.',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        role: { name: 'İnsan Kaynakları' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Token is missing or invalid.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}

