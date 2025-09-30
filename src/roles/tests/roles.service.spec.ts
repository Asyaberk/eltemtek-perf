import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../services/roles.service';
import { RolesRepository } from '../repositories/roles.repository';

describe('RolesService', () => {
  let service: RolesService;

  const mockRolesRepository = {
    save: jest.fn(),
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesRepository, useValue: mockRolesRepository }
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  //test1
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test2
  describe('create', () => {
    //test2.1
    it('can create a new role', async () => {
      const mockRole = { id: 1, name: 'admin' };
      mockRolesRepository.save.mockResolvedValue(mockRole);
      
      const result = await service.create({ name: 'admin' });

      expect(result).toEqual(mockRole);
      expect(mockRolesRepository.save).toHaveBeenCalledWith('admin');
    });

    //test2.2
    it('can throw error if role already exists', async () => {
      mockRolesRepository.save.mockRejectedValue(new Error('Role admin already exists!'));

      await expect(service.create({ name: 'admin' }))
        .rejects.toThrow('Role admin already exists!');
    });

  });

  //test3
  describe('findAll', () => {
    it('can return a list of roles', async () => {
      const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User'  }
      ];
      
      mockRolesRepository.find.mockResolvedValue(mockRoles);
      
      const result = await service.findAll();
    
      expect(result).toEqual(mockRoles);
      expect(mockRolesRepository.find).toHaveBeenCalled();
    });
  });

});
