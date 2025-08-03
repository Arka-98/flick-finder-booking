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

  get redlock() {
    return this._redlock;
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

  public async getAllFromQueue<T>(queueName: string) {
    if ((await this._redis.type(queueName)) !== 'list') {
      return [];
    }

    const data = await this._redis.lrange(queueName, 0, -1);

    return data.map<T>((item) => JSON.parse(item));
  }

  public async deleteQueue(queueName: string) {
    return this._redis.del(queueName);
  }

  public async moveAllToAnotherQueue(fromQueue: string, toQueue: string) {
    const fromQueueLength = await this._redis.llen(fromQueue);

    if (fromQueueLength > 0) {
      const pipeline = this._redis.pipeline();

      for (let i = 0; i < fromQueueLength; i++) {
        pipeline.lmove(fromQueue, toQueue, 'RIGHT', 'LEFT');
      }

      return pipeline.exec();
    }
  }

  public async addEntryToStream<T>(streamName: string, key: string, data: T) {
    return this._redis.xadd(streamName, '*', key, JSON.stringify(data));
  }

  public async readAllEntriesFromStream<T>(streamName: string) {
    const entries = await this._redis.xrange(streamName, '-', '+');

    return entries.map<T>(([, fields]) => JSON.parse(fields[1]));
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
