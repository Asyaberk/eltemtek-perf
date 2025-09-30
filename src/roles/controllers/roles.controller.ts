import { Body, Controller, Get, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { Role } from '../entities/roles.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }
 
    //list all the roles
    @Get()
    @UseInterceptors(CacheInterceptor)
    @HttpCode(200)
    @ApiOperation({ summary: 'Fetch all roles' })
    @ApiOkResponse({
        description: 'Returns a list of all roles.',
        schema: {
            type: 'array',
            example: [
                { id: 1, name: 'admin' },
                { id: 2, name: 'user' }
            ]
        }
    })async getAllRoles(): Promise<Role[]> { 
        return this.rolesService.findAll();
    }

    //create a new role
    @Post('/create')
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new role' })
    @ApiCreatedResponse({
        description: 'Role created successfully.',
        schema: {
            example: { id: 3, name: 'manager' }
        }
    })
    @ApiBadRequestResponse({
        description: 'Creation failed: Invalid data or role already exists.'
    })createRole(@Body() body: CreateRoleDto) {
        return this.rolesService.create(body);
    }

}
