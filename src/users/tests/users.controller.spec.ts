import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn()
  };
    const mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: CACHE_MANAGER, useValue: mockCache },
        Reflector,
        {
          // Interceptor’ı devre dışı bırak
          provide: CacheInterceptor,
          useValue: { intercept: (_ctx, next) => next.handle() },
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  //test1
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //test2
  describe('getAllRoles', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'admin@mail.com' },
        { id: 2, email: 'user@mail.com' }
      ];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAllRoles();

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });
});
