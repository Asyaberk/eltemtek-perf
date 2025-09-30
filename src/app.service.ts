import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private readonly cacheKey = { whatever: 'whatever' };
  private readonly logger = new Logger(AppService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  //caching
  async manualCaching() {
    //cehck if this data exists in cache
    const cachedData = await this.cacheManager.get(this.cacheKey.whatever);
    if (cachedData) {
      this.logger.debug('Cache hit: Returning cached data');
      return cachedData;
    }

    this.logger.debug('Cache miss: Computing cache');

    const data = await this.timeConsumingOperation();
    await this.cacheManager.set(this.cacheKey.whatever, data);
    return data;
  }

  //no caching
  getData2() {
    return this.timeConsumingOperation();
  }

  //test case for demonstration
  private async timeConsumingOperation() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([1, 2, 3]);
      }, 3000);
    });
  }
}
