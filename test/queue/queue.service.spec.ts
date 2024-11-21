import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../../src/queue/queue.service';

describe('QueueService', () => {
  let service: QueueService;
  let mockChannel: { sendToQueue: jest.Mock };

  beforeEach(async () => {
    mockChannel = {
      sendToQueue: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: 'RABBITMQ_CHANNEL',
          useValue: mockChannel,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should send a message to the correct queue', async () => {
      const queue = 'testQueue';
      const message = { text: 'Hello World' };

      await service.publish(queue, message);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        queue,
        expect.any(Buffer),
      );
      expect(mockChannel.sendToQueue).toHaveBeenCalledTimes(1);

      const passedBuffer = mockChannel.sendToQueue.mock.calls[0][1];
      const passedMessage = JSON.parse(passedBuffer.toString());

      expect(passedMessage).toEqual(message);
    });

    it('should correctly stringify the message before sending', async () => {
      const queue = 'testQueue';
      const message = { text: 'Test message' };

      await service.publish(queue, message);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        queue,
        expect.any(Buffer),
      );
      const passedBuffer = mockChannel.sendToQueue.mock.calls[0][1];
      const passedMessage = JSON.parse(passedBuffer.toString());

      expect(passedMessage).toEqual(message);
    });

    it('should log the correct message to the console', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const queue = 'testQueue';
      const message = { text: 'Test message' };

      await service.publish(queue, message);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Message sent to ${queue}: ${JSON.stringify(message)}`
      );

      consoleSpy.mockRestore();
    });
  });
});
