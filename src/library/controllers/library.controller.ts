import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRentalDto } from '../dtos/create-rental.dto';
import { LibraryService } from '../services/library.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../roles/decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { KafkaProducerService } from '@app/kafka/services/kafka.producer.service';

@Controller('library')
@ApiTags('Library')
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly producerService: KafkaProducerService,
  ) {}

  //user functions
  //user can see all available books, like a catalogue
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/books')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all available books' })
  @ApiOkResponse({
    description: 'Returns an array of available books',
    schema: {
      example: [
        {
          id: 1,
          title: 'Atomic Habits',
          author: 'James Clear',
          publishedYear: 2018,
          available: true,
        },
        {
          id: 2,
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publishedYear: 2008,
          available: true,
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  getAvailableBooks() {
    return this.libraryService.listAvailableBooks();
  }

  //user can see his owned rented books
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('/myBooks')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all books rented by the current user' })
  @ApiOkResponse({
    description: 'Returns an array of rentals belonging to the current user',
    schema: {
      example: [
        {
          rentalId: 10,
          book: { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
          rentDate: '2025-08-05T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  getMyBooks(@Req() req) {
    return this.libraryService.listUserRentals(req.user.id);
  }

  //renting a book
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/rent')
  @HttpCode(201)
  @ApiOperation({ summary: 'Rent a book by sending bookId' })
  @ApiBody({ type: CreateRentalDto })
  @ApiCreatedResponse({
    description: 'Successfully rented the book',
    schema: {
      example: {
        rentalId: 15,
        user: { id: 1, email: 'user@mail.com' },
        book: { id: 2, title: 'Clean Code' },
        rentDate: '2025-08-05T12:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Book not found or not available.' })
  async rentBook(@Req() req, @Body() dto: CreateRentalDto) {
    const rental = await this.libraryService.rent(req.user.id, dto);

    // Event publish
    await this.producerService.produce({
      topic: 'library.events',
      message: {
        type: 'LIBRARY_RENT_CREATED',
        payload: {
          rentalId: rental.id,
          userId: req.user.id,
          bookId: dto.bookId,
          rentDate: rental.rentdate,
        },
      },
    });

    return rental;
  }

  //returning a book by book id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/return/:bookId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Return a rented book by its bookId' })
  @ApiParam({
    name: 'bookId',
    example: 2,
    description: 'ID of the book to return',
  })
  @ApiOkResponse({
    description: 'Book returned successfully',
    schema: {
      example: {
        message: 'Book with ID 2 has been returned and is now available.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid book ID or rental not found.',
  })
  async returnBook(@Req() req, @Param('bookId') bookId: string) {
    const result = await this.libraryService.returnBook(
      req.user.id,
      Number(bookId),
    );

    // Event publish
    await this.producerService.produce({
      topic: 'library.events',
      message: {
        type: 'LIBRARY_RENT_RETURNED',
        payload: {
          userId: req.user.id,
          bookId: Number(bookId),
          returnedAt: new Date().toISOString(),
        },
      },
    });

    return result;
  }

  //admin can see all the rented books by all users
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  //exclude users password in the response
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/repository')
  @HttpCode(200)
  @ApiOperation({ summary: 'List all rentals and their status (Admin Only)' })
  @ApiOkResponse({
    description: 'Returns a list of all rentals with user and book details',
    schema: {
      example: [
        {
          rentalId: 10,
          user: { id: 1, email: 'user@mail.com' },
          book: { id: 2, title: 'Clean Code' },
          rentDate: '2025-08-05T12:00:00.000Z',
        },
        {
          rentalId: 11,
          user: { id: 2, email: 'another@mail.com' },
          book: { id: 3, title: 'Atomic Habits' },
          rentDate: '2025-08-06T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request.' })
  @ApiForbiddenResponse({
    description: 'Access denied: Only admins can create books.',
  })
  listAllRentals() {
    return this.libraryService.listAll();
  }
}
