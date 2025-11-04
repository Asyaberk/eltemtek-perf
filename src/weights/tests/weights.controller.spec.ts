import { Test, TestingModule } from '@nestjs/testing';
import { WeightsController } from './weights.controller';

describe('WeightsController', () => {
  let controller: WeightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeightsController],
    }).compile();

    controller = module.get<WeightsController>(WeightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
