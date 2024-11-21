import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(@Inject('RABBITMQ_CHANNEL') private readonly channel) {}

  async publish(queue: string, message: any) {
    const json_msg = JSON.stringify(message);
    await this.channel.sendToQueue(queue, Buffer.from(json_msg));
    console.log(`Message sent to ${queue}: ${json_msg}`);
  }
}
