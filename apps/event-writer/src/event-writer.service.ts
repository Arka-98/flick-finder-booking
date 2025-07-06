import { Injectable } from '@nestjs/common';

@Injectable()
export class EventWriterService {
  getHello(): string {
    return 'Hello World!';
  }
}
