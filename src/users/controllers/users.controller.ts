import { Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/users.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //list all the users
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Returns a list of all users.',
    schema: {
      type: 'array',
      example: [
        { id: 1, email: 'admin@mail.com', role: { id: 1, name: 'admin' } },
        { id: 2, email: 'user@mail.com', role: { id: 2, name: 'user' } },
      ],
    },
  })
  async getAllRoles(): Promise<User[]> {
    return this.userService.findAll();
  }
}
