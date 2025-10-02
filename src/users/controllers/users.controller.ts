import { Controller, Get, HttpCode, UseInterceptors, ClassSerializerInterceptor, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/users.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
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
        {
          sicil_no: 1123,
          first_last_name: 'Asya Berk',
          department: { id: 1, name: 'Ekat Şefliği' },
          role: { id: 1, name: 'Müdür Teknik' },
          tesis: { id: 1, name: 'Merkez Ankara' },
          seflik: { id: 1, name: 'Ekat Şefliği' },
          mudurluk: { id: 1, name: 'Enerji ve İletişim Müdürlüğü' },
        },
        {
          sicil_no: 2234,
          first_last_name: 'Berk Asya',
          department: { id: 1, name: 'Müdür Teknik' },
          role: { id: 2, name: 'Teknik Şef' },
          tesis: { id: 1, name: 'Merkez Ankara' },
          seflik: { id: 1, name: 'Ekat Şefliği' },
          mudurluk: { id: 1, name: 'Enerji ve İletişim Müdürlüğü' },
        },
      ],
    },
  })
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  //list spesific the user
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get single user by ID' })
  @ApiOkResponse({
    description: 'Returns a user by ID.',
    schema: {
      example: {
        id: 1,
        sicil_no: 1123,
        first_last_name: 'Asya Berk',
        department: { id: 1, name: 'Ekat Şefliği' },
        role: { id: 1, name: 'Müdür Teknik' },
        tesis: { id: 1, name: 'Merkez Ankara' },
        seflik: { id: 1, name: 'Ekat Şefliği' },
        mudurluk: { id: 1, name: 'Enerji ve İletişim Müdürlüğü' },
      },
    },
  })
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findOneById(id);
  }
}