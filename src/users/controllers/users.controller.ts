import { Controller, Get, HttpCode, UseInterceptors, ClassSerializerInterceptor, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/users.entity';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

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
          id: 1,
          sicil_no: '00518',
          first_last_name: 'Asya Berk',
          hireDate: '2024-08-15',
          evaluatedBy: {
            sicil_no: '00007',
            first_last_name: 'Talha Özkan',
          },
          department: { id: 3, department_name: 'İletişim' },
          role: { id: 2, name: 'Teknik Şef' },
          tesis: { id: 1, tesis_name: 'Merkez Ankara' },
          seflik: { id: 4, seflik_name: 'Ekat Şefliği' },
          mudurluk: { id: 2, mudurluk_name: 'Enerji Müdürlüğü' },
        },
        {
          id: 2,
          sicil_no: '00519',
          first_last_name: 'Adil Yasin BAŞTUĞ',
          hireDate: '2024-09-01',
          evaluatedBy: {
            sicil_no: '00007',
            first_last_name: 'Talha Özkan',
          },
          department: { id: 1, department_name: 'Teknik Destek' },
          role: { id: 1, name: 'Teknik Personel' },
          tesis: { id: 1, tesis_name: 'Merkez Ankara' },
          seflik: null,
          mudurluk: null,
        },
      ],
    },
  })
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  //list spesific the user
  @Get(':sicilNo')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get single user by Sicil No',
    description:
      'Fetches detailed information of a single user identified by their Sicil No (employee number).',
  })
  @ApiParam({
    name: 'sicilNo',
    type: 'string',
    description: 'The Sicil No (employee number) of the user to fetch.',
    example: '00518',
  })
  @ApiOkResponse({
    description: 'Returns detailed information of a single user.',
    schema: {
      example: {
        id: 1,
        sicil_no: '00518',
        first_last_name: 'Asya Berk',
        hireDate: '2024-08-15',
        evaluatedBy: {
          sicil_no: '00007',
          first_last_name: 'Talha Özkan',
        },
        department: { id: 3, department_name: 'İletişim' },
        role: { id: 2, name: 'Teknik Şef' },
        tesis: { id: 1, tesis_name: 'Merkez Ankara' },
        seflik: { id: 4, seflik_name: 'Ekat Şefliği' },
        mudurluk: { id: 2, mudurluk_name: 'Enerji Müdürlüğü' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User with given Sicil No not found.',
  })
  async getUserBySicilNo(@Param('sicilNo') sicilNo: string): Promise<User> {
    return this.userService.findOneBySicilNo(sicilNo);
  }

  //list evaluators personels
  @Get('evaluated-by/:evaluatorSicilNo')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all employees evaluated by a specific user',
    description:
      'Fetches all users whose `evaluatedBy` field matches the provided evaluator Sicil No. ' +
      'Applies the business rule that only users employed for 2+ months can be evaluated.',
  })
  @ApiParam({
    name: 'evaluatorSicilNo',
    type: 'string',
    description:
      'The Sicil No of the evaluator (Yönetici) whose assigned employees will be listed.',
    example: '00007',
  })
  @ApiOkResponse({
    description:
      'Returns a list of users who are evaluated by the given Sicil No (yönetici).',
    schema: {
      type: 'array',
      example: [
        {
          id: 10,
          sicil_no: '00850',
          first_last_name: 'Ali BAŞARI',
          hireDate: '2020-08-17',
          evaluatedBy: {
            sicil_no: '00007',
            first_last_name: 'Talha Özkan',
          },
        },
        {
          id: 11,
          sicil_no: '00851',
          first_last_name: 'Zeynep ARAS',
          hireDate: '2022-03-05',
          evaluatedBy: {
            sicil_no: '00007',
            first_last_name: 'Talha Özkan',
          },
        },
      ],
    },
  })
  async getEvaluatedEmployees(
    @Param('evaluatorSicilNo') evaluatorSicilNo: string,
  ): Promise<User[]> {
    return this.userService.findEmployeesByEvaluatorId(evaluatorSicilNo);
  }
}