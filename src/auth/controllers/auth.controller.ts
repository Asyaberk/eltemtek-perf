import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/entities/users.entity';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

//We add these because the password field is automatically removed from the response.
@UseInterceptors(ClassSerializerInterceptor) 
//user auth
@Controller('auth')
//api tags for swagger
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //register function
    @Post('/register')
    @HttpCode(201)
    @ApiOperation({ summary: "Register a new user" })
    @ApiCreatedResponse({
        description: "User registered successfully.",
        schema: {
            example: {
                userToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: { id: 1, email: "user@mail.com" }
            }
        }
    })
    @ApiBadRequestResponse({
        description: "Registration failed: Email is already registered or invalid data.",
        schema: {
            example: {
                statusCode: 400,
                message: "Registration failed: This email is already registered!",
                error: "Bad Request"
            }
        }
    })
    async register(@Body() body: CreateUserDto) {
        return this.authService.register(body);
    }

    //login function
    @Post('/login')
    @HttpCode(200)
    @ApiOperation({ summary: "User login" })
    @ApiBody({ type: LoginUserDto })
    @ApiOkResponse({
        description: "User logged in successfully.",
        schema: {
            example: {
                message: "SUCCESS: Logged in!",
                user: { id: 1, email: "user@mail.com", role: "admin" }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Login failed: Invalid email or password.",
        schema: {
            example: {
                statusCode: 401,
                message: "Login failed: Password is incorrect!",
                error: "Unauthorized"
            }
        }
    })
    async login(@Body() body: LoginUserDto, @Res({ passthrough: true }) response: Response) {   
        return this.authService.login(body, response);
    }

    //logout function
    @Post('/logout')
    @HttpCode(200)
    @ApiOperation({ summary: "User logout" })
    @ApiOkResponse({
        description: "User logged out successfully.",
        schema: {
            example: { message: "SUCCESS: Logged out!" }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized: No active session.",
        schema: {
            example: {
                statusCode: 401,
                message: "Unauthorized: No active session.",
                error: "Unauthorized"
            }
        }
    })
    logout(@Res({ passthrough: true }) response: Response) {
        return this.authService.logout(response);
    }

    //check current user to test login logout function
    @Get('/whoami')
    @HttpCode(200)
    @ApiOperation({ summary: "Get current authenticated user" })
    @ApiOkResponse({
        description: "Returns the details of the currently logged-in user.",
        schema: {
            example: { id: 1, email: "user@example.com", role: { name: "admin" } }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized: Token is missing or invalid.",
        schema: {
            example: {
                statusCode: 401,
                message: "Unauthorized",
                error: "Unauthorized"
            }
        }
    })
    @UseGuards(JwtAuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }
}

