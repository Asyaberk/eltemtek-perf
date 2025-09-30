import { Test } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../../users/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

//unit tests

// mock bcrypt for register(hash) and login(compare) methods
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('AuthService', () => {
  let service: AuthService;

  // mock UserRepository
  // we can use Auto mocking later on (nestjs documentation)
  const mockUserRepository = {
    //our register function from authservice uses findOneByEmail and save methods
    //so we create fake versions of these methods
    findOneByEmail: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneById: jest.fn(),
    findAll: jest.fn()
  };

  // helper: reset all repository mocks between tests
  const resetRepoMocks = () => {
    mockUserRepository.findOneByEmail.mockReset();
    mockUserRepository.save.mockReset();
    mockUserRepository.find.mockReset();
    mockUserRepository.findOneById.mockReset();
    mockUserRepository.findAll.mockReset();
  };

  // mock JwtService
  const mockJwtService = {
    //we could have used promise.resolve for these sign, findOneByEmail or save methods but jest is better for use
    sign: jest.fn().mockReturnValue('mocked-jwt-token')
  };

  //for cookies
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn()
  };


  //dependacy injection
  beforeEach(async () => {
    resetRepoMocks();
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        //override actula services with fake objects
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  //test1
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  //test2
  describe('register', () => {
    //test 2.1
    it('can create a new user', async () => {
      // email çakışmıyor gibi davran
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      
      // save gelen dto’yu yansıtıp id versin
      mockUserRepository.save.mockImplementation(async (data) => ({
        id: 1,
        ...data,
      }));

      const result = await service.register({
        email: 'newUser@mail.com',
        password: 'pswd',
        roleId: 1,
      });

      // mock output of the dependacies
      expect(result).toMatchObject({
        userToken: 'mocked-jwt-token',
        user: { id: expect.any(Number), email: 'newUser@mail.com' },
      });
    });

    //test2.2
    it('can throw an error if email is already in use', async () => {
      mockUserRepository.findOneByEmail.mockResolvedValue({ email: 'test@mail.com' });

      await expect(
        service.register({ email: 'usedMail@mail.com', password: 'pswd', roleId: 1 })
      ).rejects.toThrow('This email is already registered!');
    });
  });

  //test3
  describe('login', () => {

    //test 3.1
    it('can logged in a user', async () => {
      mockUserRepository.findOneByEmail.mockResolvedValue({email: 'login@mail.com', role: { name: 'user' } });
      const result = await service.login({ email: 'test@mail.com', password: 'pswd' }, mockResponse);

      expect(result).toEqual({
        message: 'SUCCESS: Logged in!',
        user: {email: 'login@mail.com', role: 'user' }
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'mocked-jwt-token', { httpOnly: true });
    });

    //test 3.2
    it('can throw an error if email is unused', async () => {
      //no user found
      mockUserRepository.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unused@mail.com', password: 'pswd' }, mockResponse)
      ).rejects.toThrow('No account found with this email!');
    });

    //test 3.3
    it('can throw an error if password is incorrect', async () => {
      mockUserRepository.findOneByEmail.mockResolvedValue({ email: 'test@mail.com'});
      
      //wrong password
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(false); 

      await expect(
        service.login({ email: 'test@mail.com', password: 'wrong-pswd'}, mockResponse)
      ).rejects.toThrow('Password is incorrect!');
    });
  });

  //test4
  describe('logout', () => {
    //test 4.1
    it('can clear the cookies', async () => {
      const result = service.logout(mockResponse);

      expect(result).toEqual({ message: 'SUCCESS: Logged out!' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });
});
