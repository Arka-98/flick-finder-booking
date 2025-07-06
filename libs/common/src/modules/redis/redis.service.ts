import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import Redlock, { ResourceLockedError } from 'redlock';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private _redis: Redis;
  private _redlock: Redlock;
  private readonly loggerService = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  get instance() {
    return this._redis;
  }

  public pushToQueue<T>(queueName: string, data: T[]) {
    return this._redis.lpush(
      queueName,
      ...data.map((item) => JSON.stringify(item)),
    );
  }

  public async popFromQueue<T>(queueName: string) {
    return this._redis.rpop(queueName).then((data) => JSON.parse(data) as T);
  }

  public async popAllFromQueue<T>(queueName: string) {
    const data = await this._redis.lrange(queueName, 0, -1);

    return data.map<T>((item) => JSON.parse(item));
  }

  onModuleInit() {
    this._redis = new Redis(this.configService.get('REDIS_URL'));
    this._redlock = new Redlock([this._redis], {
      retryCount: 3,
      retryDelay: 200,
      retryJitter: 100,
    });

    this._redis.on('error', (error) => {
      this.loggerService.error(error.message || error);
    });
    this._redlock.on('error', (error) => {
      if (error instanceof ResourceLockedError) {
        return;
      }

      this.loggerService.error(error.message || error);
    });
  }

  onModuleDestroy() {
    return this._redis.quit();
  }
}
