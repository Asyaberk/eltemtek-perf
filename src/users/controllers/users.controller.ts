import { Controller, Get, HttpCode, UseInterceptors, ClassSerializerInterceptor, Param, Post, UploadedFile } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/users.entity';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
//prepare imports for file upload 
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as XLSX from 'xlsx';
import { CreateUserDto } from '../dtos/create-user.dto';

@UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
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

  //file uploading with multer EXCEL READİNG
  //bu yönteni seçmemin nedeni başka excel listesi yükleme opsiyonunu açmak

  // upload Excel file & import users
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Excel file to import users',
    description:
      'Uploads an Excel file (.xlsx) containing personnel information. ' +
      'The system automatically maps columns like "Sicil No", "Adı Soyadı", "Bölümü", "Görev", "Tesis", "Şeflik", "Müdürlük".',
  })
  @ApiBody({
    description:
      'Excel file with users. Example row shows expected column names.',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      example: {
        file: '(Upload an Excel file)',
        excel_preview_row: {
          'Sicil No': '1234',
          'Adı Soyadı': 'Asya Berk',
          Bölümü: 'Enerji ve İletişim Müdürlüğü',
          Görev: 'Müdür Teknik',
          Tesis: 'Merkez Ankara',
          Şeflik: 'Ekat Şefliği',
          Müdürlük: 'Enerji ve İletişim Müdürlüğü',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Users imported successfully',
    schema: {
      example: {
        message: '3 users imported successfully',
        users: [
          {
            id: 1,
            sicil_no: '1234',
            first_last_name: 'Asya Berk',
            department: {
              id: 1,
              department_name: 'Enerji ve İletişim Müdürlüğü',
            },
            role: { id: 1, name: 'Müdür Teknik' },
            tesis: { id: 1, tesis_name: 'Merkez Ankara' },
            seflik: { id: 2, seflik_name: 'Ekat Şefliği' },
            mudurluk: { id: 3, mudurluk_name: 'Enerji ve İletişim Müdürlüğü' },
          },
        ],
      },
    },
  })
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    // Read Excel buffer
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const createdUsers: User[] = [];

    //eşleştirme
    for (const row of worksheet as any[]) {
      const ids = await this.userService.resolveIdsFromNames(
        String(row['Bölümü']).trim(),
        String(row['Görev']).trim(),
        row['Tesis'] ? String(row['Tesis']).trim() : undefined,
        row['Şeflik'] ? String(row['Şeflik']).trim() : undefined,
        row['Müdürlük'] ? String(row['Müdürlük']).trim() : undefined,
      );

      const dto: CreateUserDto = {
        sicil_no: String(row['Sicil No']).trim(),
        first_last_name: String(row['Adı Soyadı']).trim(),
        ...ids,
      };

      const user = await this.userService.create(dto);
      createdUsers.push(user);
    }

    return {
      message: `${createdUsers.length} users imported successfully`,
      users: createdUsers,
    };
  }
}