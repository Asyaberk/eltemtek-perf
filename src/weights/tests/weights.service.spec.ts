import { Test, TestingModule } from '@nestjs/testing';
import { WeightsService } from './weights.service';

describe('WeightsService', () => {
  let service: WeightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeightsService],
    }).compile();

    service = module.get<WeightsService>(WeightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
