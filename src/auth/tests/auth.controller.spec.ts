import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

//unit tests
//this spec class is for making sure that our controller class is sending and receiving the right params to service class
//its like we are checking if the endpoints returns true values
describe('AuthController', () => {
  let controller: AuthController;

  //mocks like we used in auth.serv,ce.spec.ts 
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  //test1
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //test2
  describe('register', () => {
    it('can call authService for register function', async () => {
      const dto = { email: 'test@mail.com', password: '1234', roleId: 1 };
      const expected = { userToken: 'token', user: { email: dto.email } };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);
      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  //test3
  describe('login', () => {
    it('can call authService for login function', async () => {
      const dto = { email: 'login@mail.com', password: '1234' };
      const expected = { message: 'SUCCESS: Logged in!', user: { email: dto.email } };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto, mockResponse as any);
      expect(result).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockResponse);
    });
  });

  //test4
  describe('logout', () => {
    it('can call authService for logout function', async () => {
      const expected = { message: 'SUCCESS: Logged out!' };
      mockAuthService.logout.mockReturnValue(expected);

      const result = controller.logout(mockResponse as any);
      expect(result).toEqual(expected);
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockResponse);
    });
  });

  //test5
  describe('whoAmI', () => {
    it('can return the current user', () => {
      const mockUser = { id: 1, email: 'user@mail.com', role: { name: 'admin' } };
      const result = controller.whoAmI(mockUser as any);
      expect(result).toEqual(mockUser);
    });
  });
});
