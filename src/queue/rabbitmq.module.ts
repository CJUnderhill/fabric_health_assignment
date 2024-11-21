import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Module({
    providers: [
      {
        provide: 'RABBITMQ_CHANNEL',
        useFactory: async () => {
          const connection = await amqp.connect(process.env.RABBITMQ_URI);
          return await connection.createChannel();
        },
      },
    ],
    exports: ['RABBITMQ_CHANNEL'],
  })
export class RabbitMQModule implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('RABBITMQ_URI');
    this.connection = await amqp.connect(uri);
    this.channel = await this.connection.createChannel();

    const queueName = this.configService.get<string>('RABBITMQ_QUEUE');
    await this.channel.assertQueue(queueName, { durable: true });

    console.log(`Queue "${queueName}" is ready.`);
  }

  getChannel(): amqp.Channel {
    return this.channel;
  }
}
