import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UserRepository } from '../repositories/users.repository';

describe('UsersService', () => {
  let service: UsersService;

   const mockUserRepository = {
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });


  //test1
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test2
  describe('findAll', () => {
    //test2.1
    it('should return a list of users', async () => {
      const mockUsers = [
        { id: 1, email: 'admin@mail.com' },
        { id: 2, email: 'user@mail.com' }
      ];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });
});
